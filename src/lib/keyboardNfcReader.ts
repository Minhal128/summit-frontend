/**
 * Keyboard-Emulation NFC Reader Service
 * 
 * Many NFC readers (including the TCC-TSY-TBY / CYB reader) operate in
 * "keyboard emulation" mode. When a card is tapped, the reader types the
 * card UID as rapid keystrokes via the USB HID keyboard interface, followed
 * by an Enter key.
 * 
 * Since the OS claims the keyboard HID interface, WebHID cannot access it.
 * Instead, we listen for rapid-fire keydown events in the browser and detect
 * them as NFC reader input based on timing patterns:
 *   - All characters arrive within ~100ms
 *   - Characters are hex digits (0-9, A-F) or decimal digits
 *   - Ends with Enter key or a short pause (~200ms)
 *   - Human typing is much slower (>50ms between keys)
 * 
 * This approach works without any special browser APIs or permissions.
 */

export interface KeyboardNfcEvent {
  uid: string;
  timestamp: number;
  raw: string;        // raw characters as received
  source: 'keyboard'; // to distinguish from WebHID reads
}

export interface KeyboardNfcCallbacks {
  onCardDetected?: (event: KeyboardNfcEvent) => void;
  onStatusChange?: (listening: boolean) => void;
  onError?: (error: string) => void;
}

// Timing thresholds (milliseconds)
const MAX_INTER_KEY_DELAY = 150;  // max ms between consecutive keystrokes from reader (increased for slower USB readers)
const FLUSH_TIMEOUT = 400;        // ms after last keystroke to flush buffer (increased for slower readers)
const MIN_UID_LENGTH = 4;         // minimum characters for a valid UID (4 hex = 2 bytes minimum)
const MAX_UID_LENGTH = 28;        // maximum characters (14 hex chars for 7-byte UID, with some margin)
const DEBOUNCE_SAME_UID = 1500;   // ignore same UID within this window (prevent double-tap)

class KeyboardNfcReader {
  private buffer: string = '';
  private lastKeyTime: number = 0;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private callbacks: KeyboardNfcCallbacks = {};
  private listening: boolean = false;
  private lastUid: string | null = null;
  private lastUidTime: number = 0;
  private boundKeyHandler: ((e: KeyboardEvent) => void) | null = null;
  private keystrokeTimes: number[] = [];

  /**
   * Start listening for keyboard-emulated NFC card input.
   * Attaches a global keydown listener.
   */
  start(callbacks: KeyboardNfcCallbacks): void {
    if (this.listening) return;

    this.callbacks = callbacks;
    this.listening = true;
    this.buffer = '';
    this.keystrokeTimes = [];

    this.boundKeyHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    document.addEventListener('keydown', this.boundKeyHandler, { capture: true });

    console.log('[NFC-KB] Keyboard NFC listener started');
    this.callbacks.onStatusChange?.(true);
  }

  /**
   * Stop listening.
   */
  stop(): void {
    if (!this.listening) return;

    if (this.boundKeyHandler) {
      document.removeEventListener('keydown', this.boundKeyHandler, { capture: true });
      this.boundKeyHandler = null;
    }
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    this.listening = false;
    this.buffer = '';
    this.keystrokeTimes = [];

    console.log('[NFC-KB] Keyboard NFC listener stopped');
    this.callbacks.onStatusChange?.(false);
  }

  /**
   * Check if currently listening.
   */
  isListening(): boolean {
    return this.listening;
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const now = performance.now();

    // Enter key = flush buffer immediately (most readers send Enter at end)
    if (e.key === 'Enter') {
      if (this.buffer.length >= MIN_UID_LENGTH && this.isRapidInput()) {
        e.preventDefault();
        e.stopPropagation();
        this.processBuffer();
      } else {
        // Not an NFC scan — clear buffer and let Enter propagate normally
        this.resetBuffer();
      }
      return;
    }

    // Only accept hex characters and decimal digits
    const char = e.key;
    if (char.length !== 1) return; // ignore special keys

    const isHex = /^[0-9A-Fa-f]$/.test(char);
    if (!isHex) {
      // Non-hex character — if we're accumulating a rapid scan, this breaks it
      if (this.buffer.length > 0 && this.isRapidInput()) {
        // The reader might send non-hex; flush what we have if it's long enough
        this.processBuffer();
      } else {
        this.resetBuffer();
      }
      return;
    }

    // Check timing — is this part of a rapid burst?
    const timeSinceLastKey = now - this.lastKeyTime;

    if (this.buffer.length > 0 && timeSinceLastKey > MAX_INTER_KEY_DELAY) {
      // Too slow — this is human typing, not a reader scan
      // Flush any existing rapid input, then start fresh
      if (this.isRapidInput() && this.buffer.length >= MIN_UID_LENGTH) {
        this.processBuffer();
      } else {
        this.resetBuffer();
      }
    }

    // Accumulate character
    this.buffer += char.toUpperCase();
    this.lastKeyTime = now;
    this.keystrokeTimes.push(now);

    // Prevent the character from being typed into focused inputs during rapid scan
    if (this.buffer.length >= 3 && this.isRapidInput()) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Safety: cap buffer length
    if (this.buffer.length > MAX_UID_LENGTH) {
      this.processBuffer();
      return;
    }

    // Set/reset flush timer — if no more keys arrive, flush what we have
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => {
      if (this.buffer.length >= MIN_UID_LENGTH && this.isRapidInput()) {
        this.processBuffer();
      } else {
        this.resetBuffer();
      }
    }, FLUSH_TIMEOUT);
  }

  /**
   * Check if the accumulated keystrokes arrived rapidly (NFC reader pattern).
   * Returns true if the average inter-key delay is under the threshold.
   */
  private isRapidInput(): boolean {
    if (this.keystrokeTimes.length < 2) return false; // Lowered from 3 to 2

    // Calculate average inter-key delay
    let totalDelay = 0;
    for (let i = 1; i < this.keystrokeTimes.length; i++) {
      totalDelay += this.keystrokeTimes[i] - this.keystrokeTimes[i - 1];
    }
    const avgDelay = totalDelay / (this.keystrokeTimes.length - 1);

    // NFC readers type extremely fast (< 15ms between keys typically)
    // Human typing is usually > 100ms between keys
    // Using 150ms threshold to catch slower USB readers
    return avgDelay < MAX_INTER_KEY_DELAY;
  }

  /**
   * Process the buffer as a potential NFC card UID.
   */
  private processBuffer(): void {
    const raw = this.buffer.trim();
    this.resetBuffer();

    if (raw.length < MIN_UID_LENGTH) return;

    // Validate: should be all hex characters
    if (!/^[0-9A-F]+$/i.test(raw)) return;

    // Normalize to uppercase
    const uid = raw.toUpperCase();

    // Debounce: ignore same UID within debounce window
    const now = Date.now();
    if (uid === this.lastUid && (now - this.lastUidTime) < DEBOUNCE_SAME_UID) {
      console.log(`[NFC-KB] Duplicate tap ignored: ${uid}`);
      return;
    }

    this.lastUid = uid;
    this.lastUidTime = now;

    console.log(`[NFC-KB] ✅ Card UID detected: ${uid} (${uid.length / 2} bytes)`);

    this.callbacks.onCardDetected?.({
      uid,
      timestamp: now,
      raw,
      source: 'keyboard'
    });
  }

  private resetBuffer(): void {
    this.buffer = '';
    this.keystrokeTimes = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

// Singleton
let instance: KeyboardNfcReader | null = null;

export function getKeyboardNfcReader(): KeyboardNfcReader {
  if (!instance) {
    instance = new KeyboardNfcReader();
  }
  return instance;
}

export { KeyboardNfcReader };
export default KeyboardNfcReader;
