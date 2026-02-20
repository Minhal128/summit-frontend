"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getNfcReader, NfcReaderStatus, NfcCardEvent, WebHidNfcReader } from '@/lib/webHidNfc';
import { getKeyboardNfcReader, KeyboardNfcReader, KeyboardNfcEvent } from '@/lib/keyboardNfcReader';
import { getNfcBridge, NfcBridgeClient, BridgeStatus, BridgeCardEvent, BridgeStatusEvent } from '@/lib/nfcBridge';

type NfcMode = 'keyboard' | 'webhid' | 'bridge' | 'both';

interface NfcReaderContextType {
  /** Current reader status */
  status: NfcReaderStatus;
  /** Whether WebHID is supported in this browser */
  isSupported: boolean;
  /** Whether the reader is connected (WebHID) or listening (keyboard mode) */
  isConnected: boolean;
  /** Last detected card UID (null if no card present) */
  cardUid: string | null;
  /** Current NFC reader mode */
  mode: NfcMode;
  /** Whether keyboard capture is active */
  keyboardListening: boolean;
  /** Connect to the NFC reader via WebHID (requires user gesture) */
  connectReader: () => Promise<boolean>;
  /** Disconnect the WebHID reader */
  disconnectReader: () => Promise<void>;
  /** Start keyboard-emulation NFC capture (no permissions needed) */
  startKeyboardCapture: () => void;
  /** Stop keyboard-emulation NFC capture */
  stopKeyboardCapture: () => void;
  /** Whether the NFC bridge service is connected */
  bridgeConnected: boolean;
  /** Bridge service status details */
  bridgeStatus: BridgeStatusEvent | null;
  /** Register a callback for card detection (returns unsubscribe fn) */
  onCardDetected: (callback: (card: NfcCardEvent) => void) => () => void;
  /** Register a callback for card removal (returns unsubscribe fn) */
  onCardRemoved: (callback: () => void) => () => void;
}

const NfcReaderContext = createContext<NfcReaderContextType | null>(null);

export function NfcReaderProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NfcReaderStatus>('disconnected');
  const [isSupported, setIsSupported] = useState(false);
  const [cardUid, setCardUid] = useState<string | null>(null);
  const [mode, setMode] = useState<NfcMode>('keyboard');
  const [keyboardListening, setKeyboardListening] = useState(false);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [bridgeStatusInfo, setBridgeStatusInfo] = useState<BridgeStatusEvent | null>(null);

  // Refs for dynamic callback lists
  const cardDetectedCallbacks = useRef<Set<(card: NfcCardEvent) => void>>(new Set());
  const cardRemovedCallbacks = useRef<Set<() => void>>(new Set());
  const readerRef = useRef<WebHidNfcReader | null>(null);
  const kbReaderRef = useRef<KeyboardNfcReader | null>(null);
  const bridgeRef = useRef<NfcBridgeClient | null>(null);

  // Shared card detection handler (used by both WebHID and keyboard modes)
  const handleCardDetected = useCallback((card: NfcCardEvent) => {
    setCardUid(card.uid);
    cardDetectedCallbacks.current.forEach(cb => {
      try { cb(card); } catch (e) { console.error('NFC card callback error:', e); }
    });
  }, []);

  const handleCardRemoved = useCallback(() => {
    setCardUid(null);
    cardRemovedCallbacks.current.forEach(cb => {
      try { cb(); } catch (e) { console.error('NFC removal callback error:', e); }
    });
  }, []);

  // Initialize on mount — start keyboard capture by default
  useEffect(() => {
    const webHidSupported = WebHidNfcReader.isSupported();
    setIsSupported(webHidSupported);

    // --- Keyboard NFC reader (always available, no permissions needed) ---
    const kbReader = getKeyboardNfcReader();
    kbReaderRef.current = kbReader;

    kbReader.start({
      onCardDetected: (kbEvent: KeyboardNfcEvent) => {
        console.log(`[NFC-CTX] Card detected via keyboard emulation: ${kbEvent.uid}`);
        handleCardDetected({
          uid: kbEvent.uid,
          timestamp: kbEvent.timestamp
        });
      },
      onStatusChange: (listening) => {
        setKeyboardListening(listening);
      }
    });
    setKeyboardListening(true);

    // Keyboard mode is always ready — mark as connected
    setStatus('connected');

    // --- WebHID NFC reader (optional, for readers with vendor HID protocol) ---
    if (webHidSupported) {
      const reader = getNfcReader();
      readerRef.current = reader;

      reader.setCallbacks({
        onStatusChange: (s) => {
          // Only let WebHID override status when it detects a card
          if (s === 'reading') setStatus(s);
        },
        onCardDetected: (card) => {
          console.log(`[NFC-CTX] Card detected via WebHID: ${card.uid}`);
          handleCardDetected(card);
        },
        onCardRemoved: () => {
          handleCardRemoved();
        },
        onError: (err) => {
          console.error('NFC WebHID error:', err);
        }
      });

      // Try auto-reconnect to previously paired device
      reader.tryReconnect().then(reconnected => {
        if (reconnected) {
          setMode('both');
          console.log('[NFC-CTX] Both keyboard & WebHID modes active');
        }
      });
    }

    // --- NFC Bridge Service (connects to local Python service via WebSocket) ---
    const bridge = getNfcBridge();
    bridgeRef.current = bridge;

    bridge.setCallbacks({
      onStatusChange: (bridgeState) => {
        const isConnected = bridgeState === 'connected';
        setBridgeConnected(isConnected);
        if (isConnected) {
          setMode('bridge');
          setStatus('connected');
          console.log('[NFC-CTX] Bridge service connected — CYB reader integration active');
        }
      },
      onCardDetected: (bridgeCard: BridgeCardEvent) => {
        console.log(`[NFC-CTX] Card detected via bridge: ${bridgeCard.uid} (source: ${bridgeCard.source})`);
        handleCardDetected({
          uid: bridgeCard.uid,
          timestamp: bridgeCard.timestamp,
        });
      },
      onBridgeStatus: (bs: BridgeStatusEvent) => {
        setBridgeStatusInfo(bs);
      },
      onError: (err) => {
        console.warn('[NFC-CTX] Bridge error:', err);
      },
    });

    // Auto-connect to bridge (non-blocking, reconnects automatically)
    bridge.connect();

    return () => {
      // Don't stop keyboard listener on unmount — keep alive across navigation
      // Bridge will keep reconnecting in the background
    };
  }, [handleCardDetected, handleCardRemoved]);

  const connectReader = useCallback(async (): Promise<boolean> => {
    const reader = readerRef.current || getNfcReader();
    readerRef.current = reader;
    const ok = await reader.connect();
    if (ok) setMode('both');
    return ok;
  }, []);

  const disconnectReader = useCallback(async (): Promise<void> => {
    if (readerRef.current) {
      await readerRef.current.disconnect();
    }
    setMode('keyboard');
    // Keep keyboard mode active — still connected via keyboard capture
    if (kbReaderRef.current?.isListening()) {
      setStatus('connected');
    }
  }, []);

  const startKeyboardCapture = useCallback(() => {
    const kbReader = kbReaderRef.current || getKeyboardNfcReader();
    kbReaderRef.current = kbReader;
    if (!kbReader.isListening()) {
      kbReader.start({
        onCardDetected: (kbEvent: KeyboardNfcEvent) => {
          handleCardDetected({
            uid: kbEvent.uid,
            timestamp: kbEvent.timestamp
          });
        },
        onStatusChange: (listening) => {
          setKeyboardListening(listening);
        }
      });
    }
    setStatus('connected');
  }, [handleCardDetected]);

  const stopKeyboardCapture = useCallback(() => {
    if (kbReaderRef.current) {
      kbReaderRef.current.stop();
    }
    setKeyboardListening(false);
  }, []);

  const onCardDetected = useCallback((callback: (card: NfcCardEvent) => void) => {
    cardDetectedCallbacks.current.add(callback);
    return () => {
      cardDetectedCallbacks.current.delete(callback);
    };
  }, []);

  const onCardRemoved = useCallback((callback: () => void) => {
    cardRemovedCallbacks.current.add(callback);
    return () => {
      cardRemovedCallbacks.current.delete(callback);
    };
  }, []);

  return (
    <NfcReaderContext.Provider
      value={{
        status,
        isSupported,
        isConnected: status === 'connected' || status === 'reading' || keyboardListening || bridgeConnected,
        cardUid,
        mode,
        keyboardListening,
        bridgeConnected,
        bridgeStatus: bridgeStatusInfo,
        connectReader,
        disconnectReader,
        startKeyboardCapture,
        stopKeyboardCapture,
        onCardDetected,
        onCardRemoved,
      }}
    >
      {children}
    </NfcReaderContext.Provider>
  );
}

export function useNfcReader() {
  const ctx = useContext(NfcReaderContext);
  if (!ctx) {
    throw new Error('useNfcReader must be used within <NfcReaderProvider>');
  }
  return ctx;
}

export default NfcReaderContext;
