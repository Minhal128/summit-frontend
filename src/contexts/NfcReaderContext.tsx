"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { NfcReaderStatus, NfcCardEvent } from '@/lib/webHidNfc';
import { getKeyboardNfcReader, KeyboardNfcReader, KeyboardNfcEvent } from '@/lib/keyboardNfcReader';
import { getNfcBridge, NfcBridgeClient, BridgeCardEvent, BridgeStatusEvent } from '@/lib/nfcBridge';

type NfcMode = 'keyboard' | 'bridge';

interface NfcReaderContextType {
  status: NfcReaderStatus;
  isSupported: boolean;
  isConnected: boolean;
  cardUid: string | null;
  mode: NfcMode;
  keyboardListening: boolean;
  connectReader: () => Promise<boolean>;
  disconnectReader: () => Promise<void>;
  startKeyboardCapture: () => void;
  stopKeyboardCapture: () => void;
  bridgeConnected: boolean;
  bridgeStatus: BridgeStatusEvent | null;
  onCardDetected: (callback: (card: NfcCardEvent) => void) => () => void;
  onCardRemoved: (callback: () => void) => () => void;
}

const NfcReaderContext = createContext<NfcReaderContextType | null>(null);

export function NfcReaderProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NfcReaderStatus>('disconnected');
  const [cardUid, setCardUid] = useState<string | null>(null);
  const [mode, setMode] = useState<NfcMode>('keyboard');
  const [keyboardListening, setKeyboardListening] = useState(false);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [bridgeStatusInfo, setBridgeStatusInfo] = useState<BridgeStatusEvent | null>(null);

  const cardDetectedCallbacks = useRef<Set<(card: NfcCardEvent) => void>>(new Set());
  const cardRemovedCallbacks = useRef<Set<() => void>>(new Set());
  const kbReaderRef = useRef<KeyboardNfcReader | null>(null);
  const bridgeRef = useRef<NfcBridgeClient | null>(null);

  const handleCardDetected = useCallback((card: NfcCardEvent) => {
    console.log(`[NFC-CTX] Card detected — UID: ${card.uid}`);
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

  // Initialize on mount
  useEffect(() => {
    // --- Keyboard NFC reader (always available) ---
    const kbReader = getKeyboardNfcReader();
    kbReaderRef.current = kbReader;

    kbReader.start({
      onCardDetected: (kbEvent: KeyboardNfcEvent) => {
        console.log(`[NFC-CTX] Card via keyboard: ${kbEvent.uid}`);
        handleCardDetected({ uid: kbEvent.uid, timestamp: kbEvent.timestamp });
      },
      onStatusChange: (listening) => setKeyboardListening(listening),
    });
    setKeyboardListening(true);
    setStatus('connected');

    // --- NFC Bridge Service (Python exe → WebSocket ws://localhost:9091) ---
    const bridge = getNfcBridge();
    bridgeRef.current = bridge;

    bridge.setCallbacks({
      onStatusChange: (bridgeState) => {
        const connected = bridgeState === 'connected';
        setBridgeConnected(connected);
        if (connected) {
          setMode('bridge');
          setStatus('connected');
          console.log('[NFC-CTX] Bridge connected — ready for card taps');
        } else if (bridgeState === 'disconnected') {
          setMode('keyboard');
        }
      },
      onCardDetected: (bridgeCard: BridgeCardEvent) => {
        console.log(`[NFC-CTX] Card via bridge: ${bridgeCard.uid} (source: ${bridgeCard.source})`);
        handleCardDetected({ uid: bridgeCard.uid, timestamp: bridgeCard.timestamp });
      },
      onBridgeStatus: (bs: BridgeStatusEvent) => setBridgeStatusInfo(bs),
      onError: (err) => console.warn('[NFC-CTX] Bridge error:', err),
    });

    bridge.connect();

    return () => {};
  }, [handleCardDetected, handleCardRemoved]);

  const connectReader = useCallback(async (): Promise<boolean> => {
    // Bridge or keyboard is already connected
    return true;
  }, []);

  const disconnectReader = useCallback(async (): Promise<void> => {
    // No-op — bridge handles everything
  }, []);

  const startKeyboardCapture = useCallback(() => {
    const kbReader = kbReaderRef.current || getKeyboardNfcReader();
    kbReaderRef.current = kbReader;
    if (!kbReader.isListening()) {
      kbReader.start({
        onCardDetected: (kbEvent: KeyboardNfcEvent) => {
          handleCardDetected({ uid: kbEvent.uid, timestamp: kbEvent.timestamp });
        },
        onStatusChange: (listening) => setKeyboardListening(listening),
      });
    }
    setStatus('connected');
  }, [handleCardDetected]);

  const stopKeyboardCapture = useCallback(() => {
    if (kbReaderRef.current) kbReaderRef.current.stop();
    setKeyboardListening(false);
  }, []);

  const onCardDetected = useCallback((callback: (card: NfcCardEvent) => void) => {
    cardDetectedCallbacks.current.add(callback);
    return () => { cardDetectedCallbacks.current.delete(callback); };
  }, []);

  const onCardRemoved = useCallback((callback: () => void) => {
    cardRemovedCallbacks.current.add(callback);
    return () => { cardRemovedCallbacks.current.delete(callback); };
  }, []);

  return (
    <NfcReaderContext.Provider
      value={{
        status,
        isSupported: true,
        isConnected: status === 'connected' || keyboardListening || bridgeConnected,
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
