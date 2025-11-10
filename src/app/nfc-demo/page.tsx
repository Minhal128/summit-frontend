'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { NfcLogin } from '@/components/NfcLogin';
import { NfcCardProvisioning } from '@/components/NfcCardProvisioning';
import { NfcTransactionAuth } from '@/components/NfcTransactionAuth';
import { getUserCards, getUserActivity, getStoredCardId, storeCardId, clearCardId } from '@/lib/nfcApi';
import { CreditCard, Shield, Activity, LogOut, Send, Repeat, ShoppingCart, ArrowDownUp } from 'lucide-react';
import { toast } from 'react-toastify';
import type { NfcCard, NfcActivityLog } from '@/types/nfc';

export default function NfcDemoPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [userCards, setUserCards] = useState<NfcCard[]>([]);
  const [activity, setActivity] = useState<NfcActivityLog[]>([]);
  const [showTransactionAuth, setShowTransactionAuth] = useState(false);
  const [transactionType, setTransactionType] = useState<'send' | 'swap' | 'buy' | 'sell'>('send');

  useEffect(() => {
    // Check if already authenticated
    const storedCardId = getStoredCardId();
    const token = typeof window !== 'undefined' ? localStorage.getItem('nfc_token') : null;
    
    if (storedCardId && token) {
      setCurrentCardId(storedCardId);
      setIsAuthenticated(true);
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      const cardsResponse = await getUserCards();
      setUserCards(cardsResponse.cards);

      const activityResponse = await getUserActivity(20);
      setActivity(activityResponse.activity);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleLoginSuccess = (token: string, user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    if (currentCardId) {
      storeCardId(currentCardId);
    }
    loadUserData();
    toast.success('🎉 Welcome to Summit Exchange Dashboard!');
  };

  const handleProvisionSuccess = (cardId: string) => {
    setCurrentCardId(cardId);
    storeCardId(cardId);
    toast.success('✅ Card provisioned! You can now use it to login.');
    loadUserData();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentCardId(null);
    clearCardId();
    localStorage.removeItem('nfc_token');
    localStorage.removeItem('auth_token');
    toast.info('Logged out successfully');
  };

  const handleTransactionAuth = (type: 'send' | 'swap' | 'buy' | 'sell') => {
    setTransactionType(type);
    setShowTransactionAuth(true);
  };

  const handleTransactionAuthorized = (actionPayload: any) => {
    toast.success(`${actionPayload.actionType} transaction authorized!`);
    loadUserData(); // Reload activity
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#0A1A2F',
        color: '#EBE2FF',
        minHeight: '100vh',
        paddingTop: '70px'
      }}>
        <Header />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              background: 'linear-gradient(45deg, #4CAF50, #003BFC)',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '24px'
            }}>
              🔐 SECURE NFC ACCESS
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #4CAF50, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Summit Exchange NFC System
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: 'rgba(235, 226, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Secure, non-custodial authentication using NFC cards with military-grade challenge-response signing
            </p>
          </div>

          {/* Auth Tabs */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 60px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(235, 226, 255, 0.1)',
            borderRadius: '16px',
            padding: '40px',
            backdropFilter: 'blur(10px)'
          }}>
            <Tabs defaultValue="login" className="w-full">
              <TabsList style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '4px',
                borderRadius: '12px',
                marginBottom: '32px'
              }}>
                <TabsTrigger value="login" style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Login
                </TabsTrigger>
                <TabsTrigger value="provision" style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}>
                  Provision Card
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <NfcLogin 
                  onSuccess={handleLoginSuccess}
                  onError={(error) => {
                    console.error(error);
                    toast.error('Login failed. Please try again.');
                  }}
                />
              </TabsContent>

              <TabsContent value="provision">
                <NfcCardProvisioning
                  userId="demo-user-id"
                  onSuccess={handleProvisionSuccess}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Start Guide */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(0, 59, 252, 0.1))',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>📖</span>
              Quick Start Guide
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                borderLeft: '4px solid #4CAF50'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#4CAF50' }}>
                  1. Provision a Card First
                </h4>
                <p style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)', lineHeight: '1.5' }}>
                  Go to the "Provision Card" tab and create a new NFC card. Save the Card ID that's generated - you'll need it to login.
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                borderLeft: '4px solid #00D4FF'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#00D4FF' }}>
                  2. Login with Your Card
                </h4>
                <p style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)', lineHeight: '1.5' }}>
                  Use the Card ID from step 1 to login via the "Login" tab. This will grant you access to the full dashboard.
                </p>
              </div>
              
              <div style={{
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                borderLeft: '4px solid #FF9800'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#FF9800' }}>
                  3. Authorize Transactions
                </h4>
                <p style={{ fontSize: '15px', color: 'rgba(235, 226, 255, 0.8)', lineHeight: '1.5' }}>
                  Once logged in, you can access Market Summit, Send/Receive, Swap, and Buy/Sell functions with NFC authorization.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#0A1A2F',
      color: '#EBE2FF',
      minHeight: '100vh',
      paddingTop: '70px'
    }}>
      <Header />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Dashboard Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
              Summit Exchange Dashboard
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(235, 226, 255, 0.7)' }}>
              Manage your non-custodial wallet with NFC security
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(235, 226, 255, 0.2)',
              borderRadius: '12px',
              color: '#EBE2FF',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(235, 226, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(235, 226, 255, 0.2)';
            }}
          >
            <LogOut style={{ width: '18px', height: '18px' }} />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(235, 226, 255, 0.7)' }}>
                Active Cards
              </div>
              <CreditCard style={{ width: '20px', height: '20px', color: '#4CAF50' }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#4CAF50', marginBottom: '4px' }}>
              {userCards.filter(c => c.status === 'active').length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(235, 226, 255, 0.6)' }}>
              Total: {userCards.length} cards
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 212, 255, 0.05))',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(235, 226, 255, 0.7)' }}>
                Current Card
              </div>
              <Shield style={{ width: '20px', height: '20px', color: '#00D4FF' }} />
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#00D4FF',
              fontFamily: 'monospace',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentCardId?.slice(0, 20)}...
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(235, 226, 255, 0.6)' }}>
              ECDSA P-256 Encryption
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
            border: '1px solid rgba(156, 39, 176, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(235, 226, 255, 0.7)' }}>
                Recent Activity
              </div>
              <Activity style={{ width: '20px', height: '20px', color: '#9C27B0' }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#9C27B0', marginBottom: '4px' }}>
              {activity.length}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(235, 226, 255, 0.6)' }}>
              Last 20 events
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1), rgba(255, 152, 0, 0.05))',
            border: '1px solid rgba(255, 152, 0, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(235, 226, 255, 0.7)' }}>
                Success Rate
              </div>
              <Shield style={{ width: '20px', height: '20px', color: '#FF9800' }} />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#FF9800', marginBottom: '4px' }}>
              {activity.length > 0 
                ? Math.round((activity.filter(a => a.success).length / activity.length) * 100)
                : 100}%
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(235, 226, 255, 0.6)' }}>
              Authentication success
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
            Quick Actions
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { icon: Send, label: 'Send Tokens', type: 'send' as const, color: '#4CAF50' },
              { icon: Repeat, label: 'Swap Tokens', type: 'swap' as const, color: '#00D4FF' },
              { icon: ShoppingCart, label: 'Buy Crypto', type: 'buy' as const, color: '#9C27B0' },
              { icon: ArrowDownUp, label: 'Sell Crypto', type: 'sell' as const, color: '#FF9800' }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.type}
                  onClick={() => handleTransactionAuth(action.type)}
                  style={{
                    padding: '24px',
                    background: `linear-gradient(135deg, ${action.color}15, ${action.color}05)`,
                    border: `1px solid ${action.color}40`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#EBE2FF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}25, ${action.color}10)`;
                    e.currentTarget.style.borderColor = `${action.color}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = `linear-gradient(135deg, ${action.color}15, ${action.color}05)`;
                    e.currentTarget.style.borderColor = `${action.color}40`;
                  }}
                >
                  <Icon style={{ width: '32px', height: '32px', color: action.color }} />
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>{action.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(76, 175, 80, 0.1)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            color: 'rgba(235, 226, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Shield style={{ width: '20px', height: '20px', color: '#4CAF50', flexShrink: 0 }} />
            All transactions require NFC card authorization for maximum security
          </div>
        </div>

        {/* My Cards Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
            My NFC Cards
          </h2>
          
          {userCards.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'rgba(235, 226, 255, 0.6)'
            }}>
              <CreditCard style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No cards found. Provision a card to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {userCards.map((card) => (
                <div
                  key={card.cardId}
                  style={{
                    padding: '20px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(235, 226, 255, 0.1)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #4CAF50, #003BFC)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      💳
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                        {card.metadata.cardName || 'Unnamed Card'}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        color: 'rgba(235, 226, 255, 0.6)'
                      }}>
                        {card.cardId}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right', fontSize: '13px' }}>
                      <div style={{ color: 'rgba(235, 226, 255, 0.7)' }}>
                        Used {card.usageCount} times
                      </div>
                      {card.lastUsedAt && (
                        <div style={{ fontSize: '12px', color: 'rgba(235, 226, 255, 0.5)' }}>
                          Last: {new Date(card.lastUsedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div style={{
                      padding: '6px 16px',
                      background: card.status === 'active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      border: card.status === 'active' ? '1px solid rgba(76, 175, 80, 0.5)' : '1px solid rgba(235, 226, 255, 0.2)',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: card.status === 'active' ? '#4CAF50' : 'rgba(235, 226, 255, 0.7)',
                      textTransform: 'capitalize'
                    }}>
                      {card.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(235, 226, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
            Recent Activity
          </h2>
          
          {activity.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: 'rgba(235, 226, 255, 0.6)'
            }}>
              <Activity style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.5 }} />
              <p>No activity yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activity.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    background: log.success 
                      ? 'rgba(76, 175, 80, 0.1)' 
                      : 'rgba(244, 67, 54, 0.1)',
                    border: log.success 
                      ? '1px solid rgba(76, 175, 80, 0.3)' 
                      : '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '6px 12px',
                      background: log.success ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: log.success ? '#4CAF50' : '#F44336'
                    }}>
                      {log.success ? '✓' : '✗'}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '600',
                        marginBottom: '2px',
                        textTransform: 'capitalize'
                      }}>
                        {log.eventType.replace(/_/g, ' ')}
                      </div>
                      {log.failureReason && (
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(235, 226, 255, 0.6)'
                        }}>
                          {log.failureReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: 'rgba(235, 226, 255, 0.6)'
                  }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Auth Modal */}
      {currentCardId && (
        <NfcTransactionAuth
          isOpen={showTransactionAuth}
          onClose={() => setShowTransactionAuth(false)}
          cardId={currentCardId}
          actionType={transactionType}
          actionData={{
            amount: '1.5',
            toAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            fromToken: 'ETH',
            toToken: transactionType === 'swap' ? 'USDT' : undefined
          }}
          onAuthorized={handleTransactionAuthorized}
        />
      )}

      <Footer />
    </div>
  );
}
