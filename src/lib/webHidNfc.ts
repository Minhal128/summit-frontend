/**
 * WebHID NFC Reader Service
 * 
 * Handles communication with the CYB/STM NFC reader (VID 0x0483, PID 0x4343)
 * via the WebHID API. This runs entirely in the browser — no drivers needed.
 * 
 * The CYB reader uses a vendor-specific HID protocol:
 *   - Reports are 31 bytes, Report ID 93
 *   - Byte 0: Status (0x08 = card present)
 *   - Byte 1: Card type (0x85 = 13.56 MHz)
 *   - Byte 2: Sequence counter (increments each poll, ignore for UID)
 *   - Bytes 3+: Card UID data (until padding zeros)
 */

// CYB Reader USB identifiers
const CYB_VENDOR_ID = 0x0483;
const CYB_PRODUCT_ID = 0x4343;

export type NfcReaderStatus = 'disconnected' | 'connecting' | 'connected' | 'reading' | 'error';

export interface NfcCardEvent {
  uid: string;
  timestamp: number;
}

export interface NfcReaderCallbacks {
  onStatusChange?: (status: NfcReaderStatus) => void;
  onCardDetected?: (card: NfcCardEvent) => void;
  onCardRemoved?: () => void;
  onError?: (error: string) => void;
}

class WebHidNfcReader {
  private device: HIDDevice | null = null;
  private callbacks: NfcReaderCallbacks = {};
  private status: NfcReaderStatus = 'disconnected';
  private lastUid: string | null = null;
  private sameUidCount = 0;
  private cardPresentTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Check if WebHID is available in this browser
   */
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'hid' in navigator;
  }

  /**
   * Set callbacks for events
   */
  setCallbacks(callbacks: NfcReaderCallbacks) {
    this.callbacks = callbacks;
  }

  /**
   * Get current status
   */
  getStatus(): NfcReaderStatus {
    return this.status;
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.device !== null && this.device.opened;
  }

  /**
   * Connect to the CYB NFC reader
   * MUST be called from a user gesture (click/tap) — WebHID requirement
   */
  async connect(): Promise<boolean> {
    if (!WebHidNfcReader.isSupported()) {
      this.setStatus('error');
      this.callbacks.onError?.('WebHID is not supported in this browser. Use Chrome or Edge.');
      return false;
    }

    this.setStatus('connecting');

    try {
      // Check if we already have permission for a paired device
      const existingDevices = await navigator.hid.getDevices();
      let device = existingDevices.find(
        d => d.vendorId === CYB_VENDOR_ID && d.productId === CYB_PRODUCT_ID
      );

      if (!device) {
        // Request user permission to access the device
        const devices = await navigator.hid.requestDevice({
          filters: [{ vendorId: CYB_VENDOR_ID, productId: CYB_PRODUCT_ID }]
        });

        if (devices.length === 0) {
          this.setStatus('disconnected');
          this.callbacks.onError?.('No NFC reader selected.');
          return false;
        }
        device = devices[0];
      }

      // Open the device
      if (!device.opened) {
        await device.open();
      }

      this.device = device;

      // Listen for input reports (card data)
      device.addEventListener('inputreport', (event: HIDInputReportEvent) => {
        this.handleInputReport(event);
      });

      // Listen for disconnect
      navigator.hid.addEventListener('disconnect', (event: HIDConnectionEvent) => {
        if (event.device === this.device) {
          this.device = null;
          this.lastUid = null;
          this.setStatus('disconnected');
          this.callbacks.onError?.('NFC reader disconnected.');
        }
      });

      this.setStatus('connected');
      return true;
    } catch (err: any) {
      this.setStatus('error');
      const msg = err?.message || 'Failed to connect to NFC reader';
      this.callbacks.onError?.(msg);
      return false;
    }
  }

  /**
   * Try reconnecting to a previously paired device (no user gesture needed)
   */
  async tryReconnect(): Promise<boolean> {
    if (!WebHidNfcReader.isSupported()) return false;

    try {
      const devices = await navigator.hid.getDevices();
      const device = devices.find(
        d => d.vendorId === CYB_VENDOR_ID && d.productId === CYB_PRODUCT_ID
      );

      if (!device) return false;

      if (!device.opened) {
        await device.open();
      }

      this.device = device;

      device.addEventListener('inputreport', (event: HIDInputReportEvent) => {
        this.handleInputReport(event);
      });

      navigator.hid.addEventListener('disconnect', (event: HIDConnectionEvent) => {
        if (event.device === this.device) {
          this.device = null;
          this.lastUid = null;
          this.setStatus('disconnected');
        }
      });

      this.setStatus('connected');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Disconnect from the reader
   */
  async disconnect(): Promise<void> {
    if (this.cardPresentTimeout) {
      clearTimeout(this.cardPresentTimeout);
      this.cardPresentTimeout = null;
    }
    if (this.device && this.device.opened) {
      try {
        await this.device.close();
      } catch {
        // ignore
      }
    }
    this.device = null;
    this.lastUid = null;
    this.setStatus('disconnected');
  }

  /**
   * Process incoming HID report from the CYB reader
   */
  private handleInputReport(event: HIDInputReportEvent) {
    const data = new Uint8Array(event.data.buffer);

    // Check if all zeros → no card / card removed
    const allZero = data.every(b => b === 0);
    if (allZero) {
      if (this.lastUid !== null) {
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
      return;
    }

    // CYB protocol: byte 0 = status, byte 1 = card type, byte 2 = seq counter
    const status = data[0];
    const cardType = data[1];

    // Only process if card is present (status byte has bit 0x08 set)
    if ((status & 0x08) === 0) return;

    // Extract UID: skip byte 2 (sequence counter), take bytes 3+ until zero padding
    const uid = this.extractUid(data);
    if (!uid) return;

    // Reset card-removal detection timer
    if (this.cardPresentTimeout) {
      clearTimeout(this.cardPresentTimeout);
    }
    this.cardPresentTimeout = setTimeout(() => {
      // If no report received for 500ms, assume card removed
      if (this.lastUid !== null) {
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
    }, 500);

    // Deduplicate: same card still present
    if (uid === this.lastUid) {
      this.sameUidCount++;
      return; // Suppress duplicate events
    }

    // New card detected!
    this.lastUid = uid;
    this.sameUidCount = 1;
    this.setStatus('reading');

    this.callbacks.onCardDetected?.({
      uid,
      timestamp: Date.now()
    });
  }

  /**
   * Extract stable UID from the CYB reader report.
   * 
   * The CYB reader sends the card UID in a vendor-specific format.
   * We've confirmed with the CYB_NfcTool that the real UID for a DESFire EV3 card
   * like "0441C082A92190" is 7 bytes. The reader may encode it differently in HID
   * reports, so we try multiple extraction strategies.
   */
  private extractUid(data: Uint8Array): string | null {
    // Strategy 1: The full report header is [status][type][seq][...uid bytes...]
    // Skip first 3 bytes, take non-zero bytes as UID
    const uidBytes: number[] = [];
    let foundNonZero = false;

    for (let i = 3; i < data.length; i++) {
      if (data[i] !== 0) {
        uidBytes.push(data[i]);
        foundNonZero = true;
      } else if (foundNonZero) {
        // Once we hit zeros after UID data, stop
        // But allow single zero within UID (some UIDs contain 0x00)
        if (i + 1 < data.length && data[i + 1] !== 0) {
          uidBytes.push(data[i]); // zero within UID
        } else {
          break;
        }
      }
    }

    if (uidBytes.length < 3) return null;

    // If we get exactly the right length, great
    const uid = uidBytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Strategy 2: If the UID from bytes 3+ doesn't match what CYB_NfcTool shows,
    // try using ALL non-zero bytes including header bytes
    // The CYB_NfcTool may reassemble the UID from the raw report differently
    // For now, use strategy 1 which should work for most cases

    return uid;
  }

  private setStatus(status: NfcReaderStatus) {
    if (this.status !== status) {
      this.status = status;
      this.callbacks.onStatusChange?.(status);
    }
  }
}

// Singleton instance
let readerInstance: WebHidNfcReader | null = null;

export function getNfcReader(): WebHidNfcReader {
  if (!readerInstance) {
    readerInstance = new WebHidNfcReader();
  }
  return readerInstance;
}

export { WebHidNfcReader };
export default WebHidNfcReader;
