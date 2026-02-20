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
 * 
 * IMPORTANT: The reader requires initialization commands (output reports)
 * to start its polling loop. Without sending these, the reader sits idle
 * and never fires inputreport events even though the device is "open".
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

function hexByte(b: number): string {
  return b.toString(16).toUpperCase().padStart(2, '0');
}

function hexDump(arr: Uint8Array): string {
  return Array.from(arr).map(b => hexByte(b)).join(' ');
}

class WebHidNfcReader {
  private device: HIDDevice | null = null;
  private callbacks: NfcReaderCallbacks = {};
  private status: NfcReaderStatus = 'disconnected';
  private lastUid: string | null = null;
  private sameUidCount = 0;
  private cardPresentTimeout: ReturnType<typeof setTimeout> | null = null;
  private connectInProgress = false;
  private reportCount = 0;
  private boundHandleInputReport: ((event: HIDInputReportEvent) => void) | null = null;

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
   * Attach the inputreport listener and start reader polling.
   * Removes any previous listener to avoid duplicates.
   */
  private attachListener(device: HIDDevice): void {
    // Remove old listener if exists
    if (this.boundHandleInputReport) {
      try { device.removeEventListener('inputreport', this.boundHandleInputReport); } catch { /* ignore */ }
    }
    // Create and store bound handler
    this.boundHandleInputReport = (event: HIDInputReportEvent) => {
      this.handleInputReport(event);
    };
    device.addEventListener('inputreport', this.boundHandleInputReport);
    console.log('[NFC] inputreport listener attached');
  }

  /**
   * Send initialization/polling commands to wake up the CYB reader.
   * Without these commands, the reader stays idle and won't send card data.
   * Tries multiple different command formats since the exact protocol is unknown.
   */
  private async sendInitCommands(): Promise<void> {
    if (!this.device || !this.device.opened) return;

    console.log('[NFC] Sending init commands to wake up reader...');

    try {
      const collections = this.device.collections;
      console.log(`[NFC] Device has ${collections.length} HID collection(s)`);

      for (const col of collections) {
        console.log(`[NFC] Collection: UsagePage=0x${(col.usagePage ?? 0).toString(16).toUpperCase()}, Usage=0x${(col.usage ?? 0).toString(16).toUpperCase()}`);

        // Log input report info
        if (col.inputReports?.length) {
          for (const r of col.inputReports) {
            const itemInfo = r.items?.map(item => `size=${item.reportSize}×${item.reportCount}`).join(', ') || 'none';
            console.log(`[NFC]   Input Report ID: ${r.reportId} (items: ${itemInfo})`);
          }
        }

        // Try reading feature reports (queries device state)
        if (col.featureReports?.length) {
          for (const r of col.featureReports) {
            try {
              const data = await this.device.receiveFeatureReport(r.reportId);
              console.log(`[NFC]   Feature Report ${r.reportId}: ${hexDump(new Uint8Array(data.buffer))}`);
            } catch (e: any) {
              console.log(`[NFC]   Feature Report ${r.reportId} failed: ${e.message}`);
            }
          }
        }

        // Send multiple output report commands to try to wake up the reader
        if (col.outputReports?.length) {
          for (const r of col.outputReports) {
            // Calculate correct report size from the HID descriptor items
            const reportSize = r.items?.reduce(
              (acc: number, item: HIDReportItem) => acc + Math.ceil((item.reportSize * item.reportCount) / 8), 0
            ) || 64;

            console.log(`[NFC]   Output Report ID: ${r.reportId}, size=${reportSize} bytes`);

            // Try several different init command formats
            const initCommands: number[][] = [
              [0x01],                                     // Generic poll/status request
              [0x02],                                     // Alternate init
              [0x10],                                     // Mode set
              [0x01, 0x01],                               // Poll + enable
              [0x01, 0x02],                               // Poll + card type
              [0xFF, 0x00, 0x48, 0x00, 0x00],             // ACR-style get firmware
              [0xFF, 0x00, 0x00, 0x00, 0x04, 0xD4, 0x04, 0x01, 0x00], // PN532 InListPassiveTarget
            ];

            for (const cmd of initCommands) {
              try {
                const buf = new Uint8Array(Math.max(reportSize, cmd.length));
                for (let i = 0; i < cmd.length; i++) buf[i] = cmd[i];
                await this.device.sendReport(r.reportId, buf);
                console.log(`[NFC]   ✓ Sent init [${cmd.map(b => '0x' + hexByte(b)).join(' ')}] via Report ${r.reportId}`);
              } catch (e: any) {
                console.log(`[NFC]   ✗ Init [${cmd.map(b => '0x' + hexByte(b)).join(' ')}] failed: ${e.message}`);
              }
              // Small delay between commands
              await new Promise(resolve => setTimeout(resolve, 100));
            }
          }
        }
      }

      console.log('[NFC] Init commands complete — reader should now be polling for cards');
    } catch (e: any) {
      console.log('[NFC] Init commands error:', e.message);
    }
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

    // Prevent double-connect while the browser picker is open
    if (this.connectInProgress) {
      return false;
    }

    // Already connected and open — just re-send init commands to be safe
    if (this.device && this.device.opened) {
      console.log('[NFC] Already connected, re-sending init commands');
      this.attachListener(this.device);
      await this.sendInitCommands();
      this.setStatus('connected');
      return true;
    }

    this.connectInProgress = true;
    this.setStatus('connecting');

    try {
      // Check if we already have permission for a paired device
      const existingDevices = await navigator.hid.getDevices();
      console.log(`[NFC] Found ${existingDevices.length} previously paired device(s)`);

      let device = existingDevices.find(
        d => d.vendorId === CYB_VENDOR_ID && d.productId === CYB_PRODUCT_ID
      );

      // Also try vendorId-only match in case PID differs
      if (!device) {
        device = existingDevices.find(d => d.vendorId === CYB_VENDOR_ID);
      }

      if (device) {
        console.log(`[NFC] Found paired device: ${device.productName} (VID:0x${device.vendorId.toString(16)}, PID:0x${device.productId.toString(16)})`);
      }

      if (!device) {
        // Request user permission to access the device
        console.log('[NFC] No paired device found, showing picker...');
        const devices = await navigator.hid.requestDevice({
          filters: [
            { vendorId: CYB_VENDOR_ID, productId: CYB_PRODUCT_ID },
            { vendorId: CYB_VENDOR_ID }
          ]
        });

        if (devices.length === 0) {
          this.setStatus('disconnected');
          this.connectInProgress = false;
          return false; // User cancelled — don't show error
        }
        device = devices[0];
        console.log(`[NFC] User selected: ${device.productName} (VID:0x${device.vendorId.toString(16)}, PID:0x${device.productId.toString(16)})`);
      }

      // Open the device
      if (!device.opened) {
        try {
          console.log('[NFC] Opening device...');
          await device.open();
          console.log('[NFC] Device opened successfully');
        } catch (openErr: any) {
          this.setStatus('error');
          this.connectInProgress = false;
          if (openErr?.message?.includes('access') || openErr?.message?.includes('open') || openErr?.name === 'InvalidStateError') {
            this.callbacks.onError?.('Cannot open NFC reader — close CYB_NfcTool or any other NFC software first, then try again.');
          } else {
            this.callbacks.onError?.(openErr?.message || 'Failed to open NFC reader');
          }
          return false;
        }
      } else {
        console.log('[NFC] Device already open');
      }

      this.device = device;

      // Listen for input reports (card data)
      this.attachListener(device);

      // Listen for disconnect
      navigator.hid.addEventListener('disconnect', (event: HIDConnectionEvent) => {
        if (event.device === this.device) {
          console.log('[NFC] Reader disconnected');
          this.device = null;
          this.lastUid = null;
          this.setStatus('disconnected');
          this.callbacks.onError?.('NFC reader disconnected.');
        }
      });

      // CRITICAL: Send init commands to start the reader's polling loop
      await this.sendInitCommands();

      this.setStatus('connected');
      this.connectInProgress = false;
      console.log('[NFC] ✓ Reader ready — waiting for card taps');
      return true;
    } catch (err: any) {
      this.connectInProgress = false;
      if (err?.name === 'NotAllowedError' || err?.message?.includes('cancelled') || err?.message?.includes('canceled')) {
        this.setStatus('disconnected');
        return false;
      }
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
      ) || devices.find(d => d.vendorId === CYB_VENDOR_ID);

      if (!device) {
        console.log('[NFC] tryReconnect: no paired device found');
        return false;
      }

      console.log(`[NFC] tryReconnect: found ${device.productName}`);

      if (!device.opened) {
        await device.open();
        console.log('[NFC] tryReconnect: device opened');
      }

      this.device = device;

      // Attach listener
      this.attachListener(device);

      navigator.hid.addEventListener('disconnect', (event: HIDConnectionEvent) => {
        if (event.device === this.device) {
          console.log('[NFC] Reader disconnected (auto-reconnect)');
          this.device = null;
          this.lastUid = null;
          this.setStatus('disconnected');
        }
      });

      // CRITICAL: Send init commands to start polling
      await this.sendInitCommands();

      this.setStatus('connected');
      console.log('[NFC] ✓ Auto-reconnected — waiting for card taps');
      return true;
    } catch (e: any) {
      console.log('[NFC] tryReconnect failed:', e?.message);
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
    if (this.device) {
      if (this.boundHandleInputReport) {
        try { this.device.removeEventListener('inputreport', this.boundHandleInputReport); } catch { /* ignore */ }
      }
      if (this.device.opened) {
        try {
          await this.device.close();
        } catch {
          // ignore
        }
      }
    }
    this.device = null;
    this.lastUid = null;
    this.boundHandleInputReport = null;
    this.setStatus('disconnected');
    console.log('[NFC] Disconnected');
  }

  /**
   * Process incoming HID report from the CYB reader
   */
  private handleInputReport(event: HIDInputReportEvent) {
    this.reportCount++;
    const reportId = event.reportId;

    // Handle DataView properly — may have non-zero byteOffset
    const dv = event.data;
    const data = new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength);

    // Log every report for first 20, then every 50th
    if (this.reportCount <= 20 || this.reportCount % 50 === 0) {
      console.log(`[NFC] Report #${this.reportCount} | ID:${reportId} | ${data.byteLength}B | ${hexDump(data)}`);
    }

    // Check if all bytes are zero → no card / idle polling
    const allZero = data.every(b => b === 0);
    if (allZero) {
      // Card removed (if we had one)
      if (this.lastUid !== null) {
        console.log('[NFC] Card removed (all-zero report)');
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
      return;
    }

    // Count non-zero bytes and their positions
    let nonZeroCount = 0;
    const nonZeroPositions: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i] !== 0) {
        nonZeroCount++;
        nonZeroPositions.push(i);
      }
    }

    // Log ALL non-zero reports to help debug the protocol
    console.log(`[NFC] ★ NON-ZERO Report #${this.reportCount} | ID:${reportId} | ${nonZeroCount} non-zero bytes at [${nonZeroPositions.join(',')}] | ${hexDump(data.slice(0, 16))}`);
    // Only 1-2 non-zero bytes → noise, not a card
    if (nonZeroCount < 3) {
      if (this.lastUid !== null) {
        console.log(`[NFC] Card removed (only ${nonZeroCount} non-zero bytes)`);
        this.lastUid = null;
        this.sameUidCount = 0;
        this.callbacks.onCardRemoved?.();
        this.setStatus('connected');
      }
      return;
    }

    // Extract the card UID from the report
    const uid = this.extractUid(data);
    if (!uid) {
      if (this.reportCount <= 20) {
        console.log(`[NFC] Report #${this.reportCount}: extractUid returned null | raw: ${hexDump(data.slice(0, 15))} | byte0=0x${hexByte(data[0])}`);
      }
      return;
    }

    // Reset card-removal detection timer
    if (this.cardPresentTimeout) {
      clearTimeout(this.cardPresentTimeout);
    }
    this.cardPresentTimeout = setTimeout(() => {
      if (this.lastUid !== null) {
        console.log('[NFC] Card removed (timeout)');
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

    console.log(`[NFC] ✅ NEW CARD DETECTED! UID: ${uid}`);

    this.callbacks.onCardDetected?.({
      uid,
      timestamp: Date.now()
    });
  }

  /**
   * Extract the real card UID from the CYB reader HID report.
   *
   * Since the exact protocol is unknown, we try multiple parsing strategies:
   *
   * Strategy 1 (CYB): [0x08][cardType][seq][uid_bytes...][zeros...]
   * Strategy 2 (Length-prefixed): [uidLen][uid_bytes...][zeros...]
   * Strategy 3 (Status+UID): [status][uid_bytes...][zeros...] (status > 0)
   * Strategy 4 (Raw non-zero): All non-zero bytes within positions 0-15
   *
   * The UID must be 3-10 bytes (6-20 hex chars) to be valid.
   */
  private extractUid(data: Uint8Array): string | null {
    const len = data.length;
    if (len < 3) return null;

    // Strategy 1: CYB header — byte[0] = 0x08 means card present
    if (data[0] === 0x08) {
      const uidBytes: number[] = [];
      for (let i = 3; i < Math.min(len, 12); i++) {
        if (data[i] !== 0) {
          uidBytes.push(data[i]);
        } else if (uidBytes.length > 0) {
          break;
        }
      }
      if (uidBytes.length >= 3) {
        return uidBytes.map(b => hexByte(b)).join('');
      }
    }

    // Strategy 2: First byte is UID length (4, 7, or 10 bytes)
    if ((data[0] === 4 || data[0] === 7 || data[0] === 10) && data[0] + 1 <= len) {
      const uidBytes: number[] = [];
      for (let i = 1; i <= data[0]; i++) {
        uidBytes.push(data[i]);
      }
      if (uidBytes.some(b => b !== 0) && uidBytes.length >= 3) {
        return uidBytes.map(b => hexByte(b)).join('');
      }
    }

    // Strategy 3: Skip a 1-byte status/header, read UID from byte 1
    if (data[0] !== 0) {
      const uidBytes: number[] = [];
      for (let i = 1; i < Math.min(len, 12); i++) {
        if (data[i] !== 0) {
          uidBytes.push(data[i]);
        } else if (uidBytes.length > 0) {
          break;
        }
      }
      // Must be 4 or 7 bytes (standard NFC UID lengths)
      if (uidBytes.length === 4 || uidBytes.length === 7) {
        return uidBytes.map(b => hexByte(b)).join('');
      }
    }

    // Strategy 4: Contiguous non-zero bytes starting from byte 0
    {
      const uidBytes: number[] = [];
      for (let i = 0; i < Math.min(len, 15); i++) {
        if (data[i] !== 0) {
          uidBytes.push(data[i]);
        } else if (uidBytes.length > 0) {
          break;
        }
      }
      // Must be exactly 4 or 7 bytes
      if (uidBytes.length === 4 || uidBytes.length === 7) {
        return uidBytes.map(b => hexByte(b)).join('');
      }
    }

    // Strategy 5: Collect ALL non-zero bytes in first 12 positions
    {
      const nonZero: number[] = [];
      for (let i = 0; i < Math.min(len, 12); i++) {
        if (data[i] !== 0) nonZero.push(data[i]);
      }
      if (nonZero.length >= 4 && nonZero.length <= 10) {
        return nonZero.map(b => hexByte(b)).join('');
      }
    }

    return null;
  }

  private setStatus(status: NfcReaderStatus) {
    if (this.status !== status) {
      this.status = status;
      console.log(`[NFC] Status: ${status}`);
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
