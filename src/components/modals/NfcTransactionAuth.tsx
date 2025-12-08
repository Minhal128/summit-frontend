'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard, Loader2, CheckCircle, XCircle, Shield } from 'lucide-react';
import { createActionNonce, authorizeAction } from '@/lib/nfcApi';
import { createActionMessage, simulateNfcTap, getStoredKeyPair } from '@/lib/nfcCrypto';
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

export default function NfcTransactionAuth({
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

  const handleAuthorize = async () => {
    try {
      setStep('request');
      setError('');

      // Check if card exists
      const keyPair = getStoredKeyPair(cardId);
      if (!keyPair) {
        throw new Error('Card not found. Please provision your card first.');
      }

      // Step 1: Request action nonce
      const nonceResponse = await createActionNonce({
        cardId,
        actionType,
        ...actionData
      });

      setActionPayload(nonceResponse.actionPayload);

      // Step 2: Simulate card tap
      setStep('tap');
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Sign the action
      const message = createActionMessage(nonceResponse.nonce, nonceResponse.actionPayload);
      const signature = await simulateNfcTap(cardId, message);

      // Step 4: Authorize with server
      setStep('verify');
      const authResponse = await authorizeAction({
        actionId: nonceResponse.actionId,
        cardId,
        nonce: nonceResponse.nonce,
        signature
      });

      setStep('success');

      if (onAuthorized) {
        onAuthorized(authResponse.actionPayload);
      }

      // Close after short delay
      setTimeout(() => {
        onClose();
        resetState();
      }, 2000);

    } catch (err: any) {
      console.error('Authorization error:', err);
      setStep('error');
      const errorMessage = err.message || 'Authorization failed';
      setError(errorMessage);

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

  useEffect(() => {
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
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
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
                <p className="text-sm text-muted-foreground">Hold your card near the reader to authorize</p>
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
            Step-up NFC authorization required for this transaction
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
