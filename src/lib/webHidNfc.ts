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
    // Handle DataView properly (may have byteOffset)
    const data = new Uint8Array(event.data.buffer, event.data.byteOffset, event.data.byteLength);

    // Count non-zero bytes
    let nonZeroCount = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== 0) nonZeroCount++;
    }

    // All zeros or only 1-2 non-zero bytes → no card / card removed
    if (nonZeroCount < 3) {
      if (this.lastUid !== null) {
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
      return;
    }

    // Extract a stable card fingerprint from the report
    const uid = this.extractUid(data);
    if (!uid) return;

    // Reset card-removal detection timer
    if (this.cardPresentTimeout) {
      clearTimeout(this.cardPresentTimeout);
    }
    this.cardPresentTimeout = setTimeout(() => {
      if (this.lastUid !== null) {
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
    }, 800);

    // Deduplicate: same card still present
    if (uid === this.lastUid) {
      this.sameUidCount++;
      return;
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
   * Extract a stable card fingerprint from the CYB reader HID report.
   *
   * The HID report format observed is:
   *   [status][cardType][seqCounter][...cardData...][checksum][padding zeros]
   *
   * Example: 08 85 24 AC 34 19 12 29 00 00 ...
   *   - Byte 0 (08): status/header
   *   - Byte 1 (85): card type (13.56 MHz)
   *   - Byte 2 (24→25→26): sequence counter — SKIP
   *   - Bytes 3-6 (AC 34 19 12): card-specific data — USE THIS
   *   - Byte 7 (29→93→5A): checksum — SKIP
   *
   * We build a fingerprint from ALL non-zero bytes, excluding
   * byte 2 (seq counter) and the last non-zero byte (checksum).
   */
  private extractUid(data: Uint8Array): string | null {
    const allBytes = Array.from(data);

    // Find the last non-zero byte index
    let lastNonZero = -1;
    for (let i = allBytes.length - 1; i >= 0; i--) {
      if (allBytes[i] !== 0) { lastNonZero = i; break; }
    }

    if (lastNonZero < 3) return null; // Not enough data

    // Collect stable bytes:
    // - Skip byte 2 (sequence counter)
    // - Skip lastNonZero byte (likely checksum that varies)
    const stableBytes: number[] = [];
    for (let i = 0; i <= lastNonZero - 1; i++) {
      if (i === 2) continue; // skip sequence counter
      stableBytes.push(allBytes[i]);
    }

    if (stableBytes.length < 3) return null;

    return stableBytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
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
