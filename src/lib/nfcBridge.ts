/**
 * NFC Bridge Client — Connects to the local Python NFC Bridge Service
 * 
 * The bridge service (nfc-bridge.py) runs locally on the user's machine and
 * reads card UIDs from the CYB NFC reader (via CYB_NfcTool window automation,
 * direct HID, or clipboard monitoring).
 * 
 * This client connects to ws://localhost:9091 and receives card events.
 * It integrates with the existing NfcReaderContext to provide a third
 * NFC reading strategy alongside WebHID and keyboard emulation.
 */

const BRIDGE_WS_URL = 'ws://localhost:9091';
const RECONNECT_DELAY_MIN = 3000;   // initial reconnect delay
const RECONNECT_DELAY_MAX = 60000;  // max 60s between attempts (stops spam)
const HEALTH_CHECK_URL = 'http://localhost:9091/health';
const PING_INTERVAL = 15000; // ms between pings

export type BridgeStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface BridgeCardEvent {
  uid: string;
  source: string; // 'cyb_tool' | 'direct_hid' | 'clipboard' | 'manual' | 'mass_storage'
  timestamp: number;
}

export interface BridgeStatusEvent {
  connected: boolean;
  reader: string | null;
  source: string | null;
  cyb_tool_found: boolean;
  direct_hid: boolean;
  lastUid: string | null;
  clients?: number;
}

export interface NfcBridgeCallbacks {
  onStatusChange?: (status: BridgeStatus) => void;
  onCardDetected?: (card: BridgeCardEvent) => void;
  onBridgeStatus?: (status: BridgeStatusEvent) => void;
  onError?: (error: string) => void;
}

class NfcBridgeClient {
  private ws: WebSocket | null = null;
  private callbacks: NfcBridgeCallbacks = {};
  private status: BridgeStatus = 'disconnected';
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private shouldReconnect = false;
  private lastBridgeStatus: BridgeStatusEvent | null = null;
  private reconnectDelay = RECONNECT_DELAY_MIN;
  private failCount = 0;
  private hasLoggedWaiting = false;

  /**
   * Set callbacks for bridge events
   */
  setCallbacks(callbacks: NfcBridgeCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Get current connection status
   */
  getStatus(): BridgeStatus {
    return this.status;
  }

  /**
   * Get last known bridge status
   */
  getBridgeStatus(): BridgeStatusEvent | null {
    return this.lastBridgeStatus;
  }

  /**
   * Start connecting to the bridge service
   */
  connect(): void {
    this.shouldReconnect = true;
    this._connect();
  }

  /**
   * Disconnect from the bridge service
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this._cleanup();
    this._setStatus('disconnected');
  }

  /**
   * Send a manual UID to the bridge (and back to ourselves)
   */
  sendManualUid(uid: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'manual_uid', uid }));
    }
  }

  /**
   * Request current status from bridge
   */
  requestStatus(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'request_status' }));
    }
  }

  /**
   * Check if the bridge service is running (HTTP health check)
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);
      const response = await fetch(HEALTH_CHECK_URL, {
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(timeout);
      return response.ok;
    } catch {
      return false;
    }
  }

  // ─── Private ──────────────────────────────────────────────────
  private _connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    this._setStatus('connecting');
    // Only log first attempt and when reconnecting after long backoff
    if (this.failCount === 0) {
      console.log('[NFC-Bridge] Connecting to', BRIDGE_WS_URL);
    }

    try {
      this.ws = new WebSocket(BRIDGE_WS_URL);

      this.ws.onopen = () => {
        console.log('[NFC-Bridge] Connected to bridge service');
        this._setStatus('connected');
        this._startPing();
        // Reset backoff on successful connection
        this.reconnectDelay = RECONNECT_DELAY_MIN;
        this.failCount = 0;
        this.hasLoggedWaiting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this._handleMessage(msg);
        } catch (e) {
          console.warn('[NFC-Bridge] Invalid message:', event.data);
        }
      };

      this.ws.onclose = () => {
        // Only log if we were previously connected (not on initial fail)
        if (this.failCount === 0) {
          console.log('[NFC-Bridge] Disconnected from bridge service');
        }
        this._cleanup();
        this._setStatus('disconnected');
        this._scheduleReconnect();
      };

      this.ws.onerror = () => {
        // Suppress repeated error spam — only notify once
        if (this.failCount === 0) {
          this.callbacks.onError?.('Bridge connection error');
        }
      };
    } catch (e) {
      console.warn('[NFC-Bridge] Failed to connect:', e);
      this._setStatus('error');
      this._scheduleReconnect();
    }
  }

  /**
   * Validate that a UID is a real NFC card UID, not a CYB protocol artifact.
   * CYB frames start with 55 00 — if the Python service _extract fails,
   * the raw frame bytes get sent as a UID (e.g. "55005100", "55510101FE01").
   */
  private _isValidUid(uid: string): boolean {
    if (!uid || uid.length < 8 || uid.length > 20) return false;
    // Reject CYB protocol artifacts (start with 5500 or 5551)
    if (uid.startsWith('5500') || uid.startsWith('5551')) return false;
    // Must be valid hex
    if (!/^[0-9A-Fa-f]+$/.test(uid)) return false;
    // Must not be all same byte
    const bytes = uid.match(/.{2}/g);
    if (bytes && new Set(bytes).size === 1) return false;
    return true;
  }

  private _handleMessage(msg: any): void {
    switch (msg.type) {
      case 'card_detected': {
        const uid = (msg.uid || '').toUpperCase();
        if (!this._isValidUid(uid)) {
          console.log(`[NFC-Bridge] Rejected invalid UID: ${uid}`);
          break;
        }
        console.log(`[NFC-Bridge] Card detected: ${uid} (source: ${msg.source})`);
        this.callbacks.onCardDetected?.({
          uid,
          source: msg.source,
          timestamp: msg.timestamp || Date.now(),
        });
        break;
      }

      case 'card_removed':
        // Currently the bridge doesn't actively detect removal
        break;

      case 'status':
        this.lastBridgeStatus = {
          connected: msg.connected,
          reader: msg.reader,
          source: msg.source,
          cyb_tool_found: msg.cyb_tool_found,
          direct_hid: msg.direct_hid,
          lastUid: msg.lastUid,
          clients: msg.clients,
        };
        this.callbacks.onBridgeStatus?.(this.lastBridgeStatus);
        break;

      case 'pong':
        // Ping response received
        break;
    }
  }

  private _setStatus(status: BridgeStatus): void {
    if (this.status !== status) {
      this.status = status;
      this.callbacks.onStatusChange?.(status);
    }
  }

  private _startPing(): void {
    this._stopPing();
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, PING_INTERVAL);
  }

  private _stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  private _scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectTimer) return;

    this.failCount++;
    // Exponential backoff: 3s → 6s → 12s → 24s → 48s → 60s (cap)
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, RECONNECT_DELAY_MAX);

    // Log once that we're waiting, then go quiet
    if (!this.hasLoggedWaiting) {
      console.log('[NFC-Bridge] Service not detected — will retry silently in background. Run SummitNfcService.exe to enable NFC.');
      this.hasLoggedWaiting = true;
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.shouldReconnect) {
        this._connect();
      }
    }, this.reconnectDelay);
  }

  private _cleanup(): void {
    this._stopPing();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onclose = null;
        this.ws.onerror = null;
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch {
        // ignore
      }
      this.ws = null;
    }
  }
}

// Singleton instance
let bridgeInstance: NfcBridgeClient | null = null;

export function getNfcBridge(): NfcBridgeClient {
  if (!bridgeInstance) {
    bridgeInstance = new NfcBridgeClient();
  }
  return bridgeInstance;
}

export { NfcBridgeClient };
export default NfcBridgeClient;
