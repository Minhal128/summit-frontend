'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { createAuthNonce, authenticateWithNfc, authenticateWithTap } from '@/lib/nfcApi';
import { createAuthMessage, simulateNfcTap, scanNfcCard, isWebNfcAvailable } from '@/lib/nfcCrypto';
import { toast } from 'react-toastify';

interface NfcLoginProps {
  onSuccess?: (token: string, user: any) => void;
  onError?: (error: string) => void;
}

type LoginStep = 'input' | 'requesting' | 'tap' | 'verifying' | 'success' | 'error';

export function NfcLogin({ onSuccess, onError }: NfcLoginProps) {
  const [cardId, setCardId] = useState('');
  const [step, setStep] = useState<LoginStep>('input');
  const [error, setError] = useState('');
  const [nonce, setNonce] = useState('');
  const hasWebNfc = typeof window !== 'undefined' && isWebNfcAvailable();
  const router = useRouter();

  /**
   * Login with physical NFC card tap (PRODUCTION MODE)
   * Uses Web NFC to read cardId from DESFire EV3, then authenticates via backend
   */
  const handleTapLogin = async () => {
    try {
      setStep('tap');
      setError('');

      // Scan physical NFC card
      const cardData = await scanNfcCard();
      
      setStep('verifying');
      
      // Authenticate with backend (backend verifies card ownership by cardId + UID)
      const authResponse = await authenticateWithTap({
        cardId: cardData.cardId,
        cardUid: cardData.cardUid
      });

      setStep('success');
      toast.success('Authentication successful!');
      
      if (onSuccess) {
        onSuccess(authResponse.token, authResponse.user);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('NFC tap login error:', err);
      setStep('error');
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  /**
   * Login with card ID input (DEMO MODE or manual entry)
   * Uses browser-simulated signing
   */
  const handleManualLogin = async () => {
    if (!cardId.trim()) {
      toast.error('Please enter your card ID');
      return;
    }

    try {
      setStep('requesting');
      setError('');

      // Step 1: Request nonce
      const nonceResponse = await createAuthNonce(cardId);
      setNonce(nonceResponse.nonce);

      // Step 2: Simulate card tap
      setStep('tap');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Show tap animation

      // Step 3: Sign with card
      const timestamp = Date.now();
      const message = createAuthMessage(nonceResponse.nonce, cardId, timestamp);
      
      setStep('verifying');
      const signature = await simulateNfcTap(cardId, message);

      // Step 4: Authenticate with server
      const authResponse = await authenticateWithNfc({
        cardId,
        nonce: nonceResponse.nonce,
        signature,
        timestamp
      });

      setStep('success');
      toast.success('Authentication successful!');
      
      if (onSuccess) {
        onSuccess(authResponse.token, authResponse.user);
      }

      // Redirect or perform action after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err: any) {
      console.error('NFC login error:', err);
      setStep('error');
      const errorMessage = err.message || 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const resetLogin = () => {
    setStep('input');
    setError('');
    setNonce('');
  };

  const renderStepContent = () => {
    switch (step) {
      case 'input':
        return (
          <div className="space-y-4">
            {/* Real NFC tap button (shows only on supported devices) */}
            {hasWebNfc && (
              <Button 
                onClick={handleTapLogin} 
                className="w-full"
                size="lg"
                variant="default"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Tap NFC Card to Login
              </Button>
            )}

            {hasWebNfc && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or enter manually
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cardId">NFC Card ID</Label>
              <Input
                id="cardId"
                placeholder="Enter your card ID (e.g., SUMMIT-EV3-A1B2C3D4)"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualLogin()}
              />
            </div>
            <Button 
              onClick={handleManualLogin} 
              className="w-full"
              size="lg"
              variant={hasWebNfc ? "outline" : "default"}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Login with Card ID
            </Button>
          </div>
        );

      case 'requesting':
        return (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold">Requesting authentication...</p>
              <p className="text-sm text-muted-foreground">Please wait</p>
            </div>
          </div>
        );

      case 'tap':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="relative">
              <CreditCard className="h-16 w-16 mx-auto text-primary animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-lg">Tap your NFC card</p>
              <p className="text-sm text-muted-foreground">Hold your card near the reader</p>
            </div>
          </div>
        );

      case 'verifying':
        return (
          <div className="text-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <div>
              <p className="font-semibold">Verifying signature...</p>
              <p className="text-sm text-muted-foreground">Authenticating with server</p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
            <div>
              <p className="font-semibold text-lg text-green-600">Authentication Successful!</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8 space-y-4">
            <XCircle className="h-16 w-16 mx-auto text-red-500" />
            <div>
              <p className="font-semibold text-lg text-red-600">Authentication Failed</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={resetLogin} variant="outline">
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          NFC Card Login
        </CardTitle>
        <CardDescription>
          Authenticate securely using your NFC card
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
