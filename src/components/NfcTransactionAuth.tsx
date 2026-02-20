'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { createActionNonce, authorizeAction, authorizeActionByUid } from '@/lib/nfcApi';
import { createActionMessage, simulateNfcTap, getStoredKeyPair } from '@/lib/nfcCrypto';
import { useNfcReader } from '@/contexts/NfcReaderContext';
import { toast } from 'react-toastify';
import type { ActionPayload } from '@/types/nfc';

interface NfcTransactionAuthProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: string;
  actionType: 'send' | 'swap' | 'buy' | 'sell';
  actionData: {
    amount?: string;
    toAddress?: string;
    fromToken?: string;
    toToken?: string;
    [key: string]: any;
  };
  onAuthorized?: (actionPayload: ActionPayload) => void;
  onError?: (error: string) => void;
}

type AuthStep = 'request' | 'tap' | 'verify' | 'success' | 'error';

export function NfcTransactionAuth({
  isOpen,
  onClose,
  cardId,
  actionType,
  actionData,
  onAuthorized,
  onError
}: NfcTransactionAuthProps) {
  const [step, setStep] = useState<AuthStep>('request');
  const [error, setError] = useState('');
  const [actionPayload, setActionPayload] = useState<ActionPayload | null>(null);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const pendingActionIdRef = useRef<string | null>(null);
  const stepRef = useRef<AuthStep>('request');

  const { onCardDetected, bridgeConnected } = useNfcReader();

  // Keep refs in sync
  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { pendingActionIdRef.current = pendingActionId; }, [pendingActionId]);

  // Listen for NFC card tap via bridge/keyboard/WebHID
  useEffect(() => {
    if (!isOpen) return;

    const unsub = onCardDetected(async (card) => {
      // Only process if we're in the 'tap' step waiting for a card
      if (stepRef.current !== 'tap') return;
      const actionId = pendingActionIdRef.current;
      if (!actionId) return;

      try {
        setStep('verify');

        // Authorize using card UID
        const authResponse = await authorizeActionByUid({
          actionId,
          cardUid: card.uid,
        });

        setStep('success');
        toast.success('Transaction authorized!');

        if (onAuthorized) {
          onAuthorized(authResponse.actionPayload);
        }

        setTimeout(() => {
          onClose();
          resetState();
        }, 2000);
      } catch (err: any) {
        console.error('UID authorization error:', err);
        setStep('error');
        const errorMessage = err.message || 'Authorization failed';
        setError(errorMessage);
        toast.error(errorMessage);
        if (onError) onError(errorMessage);
      }
    });

    return unsub;
  }, [isOpen, onCardDetected, onAuthorized, onError, onClose]);

  const handleAuthorize = async () => {
    try {
      setStep('request');
      setError('');

      // Step 1: Request action nonce from server
      const nonceResponse = await createActionNonce({
        cardId,
        actionType,
        ...actionData
      });

      setActionPayload(nonceResponse.actionPayload);
      setPendingActionId(nonceResponse.actionId);

      // Step 2: Wait for real NFC card tap
      setStep('tap');
      // The onCardDetected listener above will handle the rest

    } catch (err: any) {
      console.error('Authorization error:', err);
      setStep('error');
      const errorMessage = err.message || 'Authorization failed';
      setError(errorMessage);
      toast.error(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const resetState = () => {
    setStep('request');
    setError('');
    setActionPayload(null);
  };

  const handleClose = () => {
    if (step !== 'tap' && step !== 'verify') {
      onClose();
      resetState();
    }
  };

  React.useEffect(() => {
    if (isOpen && step === 'request') {
      handleAuthorize();
    }
  }, [isOpen]);

  const getActionTitle = () => {
    switch (actionType) {
      case 'send': return 'Authorize Send Transaction';
      case 'swap': return 'Authorize Token Swap';
      case 'buy': return 'Authorize Purchase';
      case 'sell': return 'Authorize Sale';
      default: return 'Authorize Transaction';
    }
  };

  const getActionDetails = () => {
    if (!actionPayload) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Action:</span>
          <span className="font-medium capitalize">{actionType}</span>
        </div>
        {actionPayload.amount && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">{actionPayload.amount}</span>
          </div>
        )}
        {actionPayload.fromToken && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">From:</span>
            <span className="font-medium">{actionPayload.fromToken}</span>
          </div>
        )}
        {actionPayload.toToken && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">To:</span>
            <span className="font-medium">{actionPayload.toToken}</span>
          </div>
        )}
        {actionPayload.toAddress && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">To Address:</span>
            <span className="font-mono text-xs">{actionPayload.toAddress.slice(0, 10)}...</span>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (step) {
      case 'request':
        return (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold">Creating authorization request...</p>
              <p className="text-sm text-muted-foreground">Please wait</p>
            </div>
          </div>
        );

      case 'tap':
        return (
          <div className="space-y-6">
            {getActionDetails()}
            
            <div className="text-center py-8 space-y-4">
              <div className="relative">
                <CreditCard className="h-16 w-16 mx-auto text-primary animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-lg">Tap your NFC card</p>
                <p className="text-sm text-muted-foreground">
                  {bridgeConnected
                    ? 'Place your card on the CYB reader to authorize this transaction'
                    : 'Hold your card near the reader to authorize'}
                </p>
                {bridgeConnected && (
                  <p className="text-xs text-emerald-500 mt-1 animate-pulse">NFC Bridge connected — waiting for card...</p>
                )}
              </div>
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold">Verifying authorization...</p>
              <p className="text-sm text-muted-foreground">Confirming with server</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <p className="font-semibold text-lg text-green-600">Transaction Authorized!</p>
              <p className="text-sm text-muted-foreground">Proceeding with transaction...</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8 space-y-4">
            <XCircle className="h-16 w-16 mx-auto text-red-500" />
            <div>
              <p className="font-semibold text-lg text-red-600">Authorization Failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {getActionTitle()}
          </DialogTitle>
          <DialogDescription>
            Step-up authorization required for this transaction
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
