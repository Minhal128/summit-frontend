// NFC Card Types
export interface NfcCard {
  cardId: string;
  cardUid: string;
  status: 'active' | 'blocked' | 'suspended' | 'revoked';
  keyType: 'P-256' | 'Ed25519' | 'secp256k1';
  metadata: {
    cardName?: string;
    generation?: number;
    manufacturer?: string;
  };
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
}

// Nonce Response Types
export interface NonceResponse {
  success: boolean;
  nonce: string;
  expiresAt: string;
  ttl: number;
}

export interface ActionNonceResponse extends NonceResponse {
  actionId: string;
  actionPayload: ActionPayload;
}

// Action Payload
export interface ActionPayload {
  actionId: string;
  actionType: 'send' | 'swap' | 'buy' | 'sell';
  amount?: string;
  toAddress?: string;
  fromToken?: string;
  toToken?: string;
  params?: Record<string, any>;
  timestamp: number;
}

// Authentication Response
export interface NfcAuthResponse {
  success: boolean;
  token: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    wallet?: {
      address: string;
    };
  };
  cardInfo: {
    cardId: string;
    lastUsed?: string;
  };
}

// Authorization Response
export interface ActionAuthorizationResponse {
  success: boolean;
  message: string;
  actionPayload: ActionPayload;
  authorized: boolean;
  timestamp: number;
}

// Card Provisioning
export interface ProvisionCardRequest {
  cardId: string;
  cardUid: string;
  publicKey: string;
  keyType: 'P-256' | 'Ed25519' | 'secp256k1';
  userId: string;
  metadata?: {
    cardName?: string;
    generation?: number;
    manufacturer?: string;
  };
}

// Activity Log
export interface NfcActivityLog {
  eventType: string;
  cardId?: string;
  actionType?: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
  };
}

// User Cards Response
export interface UserCardsResponse {
  success: boolean;
  cards: NfcCard[];
}

// Activity Response
export interface ActivityResponse {
  success: boolean;
  activity: NfcActivityLog[];
}
