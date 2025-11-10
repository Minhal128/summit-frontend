'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Key, Shield, Activity, Plus, Loader2 } from 'lucide-react';
import { getUserCards, getUserActivity, provisionCard, getStoredCardId, storeCardId } from '@/lib/nfcApi';
import { generateKeyPair, storeKeyPair, jwkToPem } from '@/lib/nfcCrypto';
import type { NfcCard, NfcActivityLog } from '@/types/nfc';

export default function NfcManagement() {
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [activity, setActivity] = useState<NfcActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProvision, setShowProvision] = useState(false);
  const [cardName, setCardName] = useState('');
  const [provisioning, setProvisioning] = useState(false);
  const currentCardId = getStoredCardId();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cardsResponse, activityResponse] = await Promise.all([
        getUserCards(),
        getUserActivity(20)
      ]);
      setCards(cardsResponse.cards);
      setActivity(activityResponse.activity);
    } catch (error) {
      console.error('Failed to load NFC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProvisionCard = async () => {
    if (!cardName.trim()) return;

    try {
      setProvisioning(true);

      // Generate key pair
      const keyPair = await generateKeyPair('P-256');

      // Create unique card ID
      const cardId = `CARD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const cardUid = `UID_${Date.now()}`;

      // Store key pair locally
      storeKeyPair(cardId, keyPair);

      // Convert public key to PEM
      const publicKeyPem = jwkToPem(keyPair.publicKey);

      // Get user ID from token
      const token = localStorage.getItem('auth_token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = payload?.id || 'demo-user-id';

      // Provision card with server
      await provisionCard({
        cardId,
        cardUid,
        publicKey: publicKeyPem,
        keyType: 'P-256',
        userId,
        metadata: {
          cardName: cardName.trim(),
          generation: 1,
          manufacturer: 'Summit Exchange'
        }
      });

      // Set as active card
      storeCardId(cardId);

      // Reload data
      await loadData();
      
      setShowProvision(false);
      setCardName('');
      alert(`Card provisioned successfully!\n\nCard ID: ${cardId}\n\nSave this ID for future logins.`);
    } catch (error: any) {
      console.error('Provisioning error:', error);
      alert(error.message || 'Failed to provision card');
    } finally {
      setProvisioning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">NFC Security</h2>
          <p className="text-muted-foreground">Manage your NFC cards and security settings</p>
        </div>
        <Button onClick={() => setShowProvision(!showProvision)}>
          <Plus className="mr-2 h-4 w-4" />
          Provision Card
        </Button>
      </div>

      {/* Provisioning Form */}
      {showProvision && (
        <Card>
          <CardHeader>
            <CardTitle>Provision New NFC Card</CardTitle>
            <CardDescription>Generate and register a new NFC card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                placeholder="e.g., Primary Card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={provisioning}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleProvisionCard} disabled={provisioning || !cardName.trim()}>
                {provisioning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Provision Card
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowProvision(false)} disabled={provisioning}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cards.filter(c => c.status === 'active').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Card</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">{currentCardId ? currentCardId.slice(0, 20) + '...' : 'None'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activity.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* My Cards */}
      <Card>
        <CardHeader>
          <CardTitle>My NFC Cards</CardTitle>
          <CardDescription>Manage your registered cards</CardDescription>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cards found. Provision a card to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.cardId}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    card.cardId === currentCardId ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{card.metadata.cardName || 'Unnamed Card'}</p>
                      <p className="text-sm text-muted-foreground font-mono">{card.cardId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Used {card.usageCount} times</p>
                      {card.lastUsedAt && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(card.lastUsedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                      {card.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your NFC authentication and authorization history</CardDescription>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity yet
            </div>
          ) : (
            <div className="space-y-2">
              {activity.map((log, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    log.success ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900' : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={log.success ? 'default' : 'destructive'}>
                      {log.success ? '✓' : '✗'}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {log.eventType.replace(/_/g, ' ')}
                      </p>
                      {log.failureReason && (
                        <p className="text-xs text-muted-foreground">{log.failureReason}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
