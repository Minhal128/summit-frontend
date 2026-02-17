"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { getNfcReader, NfcReaderStatus, NfcCardEvent, WebHidNfcReader } from '@/lib/webHidNfc';

interface NfcReaderContextType {
  /** Current reader status */
  status: NfcReaderStatus;
  /** Whether WebHID is supported in this browser */
  isSupported: boolean;
  /** Whether the reader is connected */
  isConnected: boolean;
  /** Last detected card UID (null if no card present) */
  cardUid: string | null;
  /** Connect to the NFC reader (requires user gesture) */
  connectReader: () => Promise<boolean>;
  /** Disconnect the reader */
  disconnectReader: () => Promise<void>;
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

  // Refs for dynamic callback lists
  const cardDetectedCallbacks = useRef<Set<(card: NfcCardEvent) => void>>(new Set());
  const cardRemovedCallbacks = useRef<Set<() => void>>(new Set());
  const readerRef = useRef<WebHidNfcReader | null>(null);

  // Initialize on mount
  useEffect(() => {
    const supported = WebHidNfcReader.isSupported();
    setIsSupported(supported);

    if (supported) {
      const reader = getNfcReader();
      readerRef.current = reader;

      // Set up persistent callbacks on the reader
      reader.setCallbacks({
        onStatusChange: (s) => setStatus(s),
        onCardDetected: (card) => {
          setCardUid(card.uid);
          // Notify all subscribers
          cardDetectedCallbacks.current.forEach(cb => {
            try { cb(card); } catch (e) { console.error('NFC card callback error:', e); }
          });
        },
        onCardRemoved: () => {
          setCardUid(null);
          cardRemovedCallbacks.current.forEach(cb => {
            try { cb(); } catch (e) { console.error('NFC removal callback error:', e); }
          });
        },
        onError: (err) => {
          console.error('NFC Reader error:', err);
        }
      });

      // Try auto-reconnect to previously paired device
      reader.tryReconnect();
    }

    return () => {
      // Don't disconnect on unmount — keep the reader alive across navigation
    };
  }, []);

  const connectReader = useCallback(async (): Promise<boolean> => {
    const reader = readerRef.current || getNfcReader();
    readerRef.current = reader;
    return reader.connect();
  }, []);

  const disconnectReader = useCallback(async (): Promise<void> => {
    if (readerRef.current) {
      await readerRef.current.disconnect();
    }
    setCardUid(null);
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
        isConnected: status === 'connected' || status === 'reading',
        cardUid,
        connectReader,
        disconnectReader,
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
