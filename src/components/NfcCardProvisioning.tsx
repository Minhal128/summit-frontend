'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, CheckCircle, Key } from 'lucide-react';
import { provisionCard } from '@/lib/nfcApi';
import { generateKeyPair, storeKeyPair, jwkToPem } from '@/lib/nfcCrypto';
import { toast } from 'react-toastify';

interface NfcCardProvisioningProps {
  userId: string;
  onSuccess?: (cardId: string) => void;
}

export function NfcCardProvisioning({ userId, onSuccess }: NfcCardProvisioningProps) {
  const [cardName, setCardName] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedCardId, setProvisionedCardId] = useState<string | null>(null);

  const handleProvision = async () => {
    if (!cardName.trim()) {
      toast.error('Please enter a name for your card');
      return;
    }

    try {
      setIsProvisioning(true);

      // Step 1: Generate key pair
      toast.info('Generating key pair...');
      const keyPair = await generateKeyPair('P-256');

      // Step 2: Create unique card ID
      const cardId = `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const cardUid = `UID_${Date.now()}`;

      // Step 3: Store key pair (for demo - in production this stays on card)
      storeKeyPair(cardId, keyPair);

      // Step 4: Convert public key to PEM format
      const publicKeyPem = jwkToPem(keyPair.publicKey);

      // Step 5: Provision card with server
      toast.info('Registering card with server...');
      await provisionCard({
        cardId,
        cardUid,
        publicKey: publicKeyPem,
        keyType: 'P-256',
        userId,
        metadata: {
          cardName: cardName.trim(),
          generation: 1,
          manufacturer: 'Summit Exchange Demo'
        }
      });

      setProvisionedCardId(cardId);
      toast.success('Card provisioned successfully!');

      if (onSuccess) {
        onSuccess(cardId);
      }

    } catch (err: any) {
      console.error('Provisioning error:', err);
      toast.error(err.message || 'Failed to provision card');
    } finally {
      setIsProvisioning(false);
    }
  };

  if (provisionedCardId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            Card Provisioned Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-medium text-green-800 mb-2">Your Card ID:</p>
            <code className="block bg-white px-3 py-2 rounded border border-green-300 text-sm font-mono">
              {provisionedCardId}
            </code>
            <p className="text-xs text-green-600 mt-2">
              ⚠️ Save this Card ID - you'll need it to login
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              <strong>Card Name:</strong> {cardName}
            </p>
            <p className="text-sm">
              <strong>Key Type:</strong> ECDSA P-256
            </p>
            <p className="text-sm text-muted-foreground">
              Your card is now ready to use. You can use the Card ID above to authenticate with NFC login.
            </p>
          </div>

          <Button
            onClick={() => {
              setProvisionedCardId(null);
              setCardName('');
            }}
            variant="outline"
            className="w-full"
          >
            Provision Another Card
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-6 w-6" />
          Provision NFC Card
        </CardTitle>
        <CardDescription>
          Generate and register a new NFC card for secure authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Card Name</Label>
          <Input
            id="cardName"
            placeholder="e.g., My Primary Card"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            disabled={isProvisioning}
          />
          <p className="text-xs text-muted-foreground">
            Give your card a friendly name for easy identification
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-sm text-blue-900 mb-2">What happens during provisioning?</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Generate a secure key pair (ECDSA P-256)</li>
            <li>• Create unique card identifier</li>
            <li>• Register public key with server</li>
            <li>• Store private key securely (simulated)</li>
          </ul>
        </div>

        <Button
          onClick={handleProvision}
          disabled={isProvisioning || !cardName.trim()}
          className="w-full"
          size="lg"
        >
          {isProvisioning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Provisioning Card...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Provision Card
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Note: In production, key generation happens on the physical NFC card's secure element.
          This is a demonstration using browser cryptography.
        </p>
      </CardContent>
    </Card>
  );
}
