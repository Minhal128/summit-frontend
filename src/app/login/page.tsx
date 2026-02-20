"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { loginByUid, linkCard } from "@/lib/nfcApi";
import { useNfcReader } from "@/contexts/NfcReaderContext";

// --- HELPER & SIMULATED SHADCN/UI COMPONENTS ---
const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(" ");

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-12 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-gray-200 placeholder:text-gray-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";

// --- SVG ICONS ---
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
    />
  </svg>
);

// --- MAIN LOGIN PAGE COMPONENT ---
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { status: readerStatus, isSupported: hasWebHid, isConnected: readerConnected, connectReader, onCardDetected, keyboardListening, bridgeConnected, bridgeStatus, mode } = useNfcReader();

  // NFC Login State
  const [nfcStep, setNfcStep] = useState<"idle" | "connecting" | "waiting" | "checking" | "create_pin" | "pin_entry" | "verifying" | "success" | "error">("idle");
  const [nfcError, setNfcError] = useState("");
  const [detectedUid, setDetectedUid] = useState<string | null>(null);
  const [nfcPin, setNfcPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [linkEmail, setLinkEmail] = useState("");
  const [linkPassword, setLinkPassword] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const nfcStepRef = useRef(nfcStep);
  nfcStepRef.current = nfcStep;

  // Auto-enter waiting state when bridge connects (seamless experience)
  useEffect(() => {
    if (bridgeConnected && nfcStep === "idle") {
      setNfcStep("waiting");
    }
  }, [bridgeConnected, nfcStep]);

  // Auto-login when card is tapped while in "waiting" state
  useEffect(() => {
    const unsub = onCardDetected(async (card) => {
      // Process if we're actively waiting OR if keyboard mode is always listening
      if (nfcStepRef.current !== "waiting" && nfcStepRef.current !== "idle") return;

      setDetectedUid(card.uid);
      setNfcPin("");
      setConfirmPin("");
      setNfcError("");
      setNfcStep("checking");

      // Probe backend to see if card is registered (send without PIN)
      try {
        const response = await loginByUid(card.uid);
        // If somehow succeeds without PIN (shouldn't happen but handle it)
        if (response.success) {
          setNfcStep("success");
          toast.success("NFC login successful! Redirecting...");
          setTimeout(() => router.push("/dashboard"), 800);
        }
      } catch (err: any) {
        if (err?.data?.unregistered || err?.message?.includes("not registered")) {
          // Card not linked — show Create PIN + account linking
          setNfcStep("create_pin");
        } else if (err?.data?.pinRequired || err?.message?.includes("PIN is required")) {
          // Card registered with a PIN — ask user to enter it
          setNfcStep("pin_entry");
        } else {
          setNfcStep("error");
          setNfcError(err?.message || "Failed to check card");
        }
      }
    });
    return unsub;
  }, [onCardDetected, router]);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("auth_token") || localStorage.getItem("nfc_token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // --- NFC TAP LOGIN: Connect reader and wait for card ---
  const handleNfcTapLogin = useCallback(async () => {
    setNfcError("");
    // If bridge is connected, we're already listening — just switch to waiting state
    if (bridgeConnected) {
      setNfcStep("waiting");
      return;
    }
    // If keyboard capture is active, we're already listening — just switch to waiting state
    if (keyboardListening) {
      setNfcStep("waiting");
      return;
    }
    if (readerConnected) {
      setNfcStep("waiting");
      return;
    }
    setNfcStep("connecting");
    const ok = await connectReader();
    if (ok) {
      setNfcStep("waiting");
    } else {
      if (readerStatus === 'error') {
        setNfcStep("error");
        setNfcError("Could not connect to NFC reader. Make sure it's plugged in and the NFC Bridge service is running.");
      } else {
        setNfcStep("idle");
      }
    }
  }, [readerConnected, readerStatus, connectReader, keyboardListening, bridgeConnected]);

  const resetNfcLogin = () => {
    setNfcStep("idle");
    setNfcError("");
    setDetectedUid(null);
    setNfcPin("");
    setConfirmPin("");
    setLinkEmail("");
    setLinkPassword("");
  };

  // Submit PIN to login with detected card UID
  const handlePinSubmit = async () => {
    if (!detectedUid || !nfcPin) return;
    if (nfcPin.length < 4) {
      setNfcError("PIN must be at least 4 digits");
      return;
    }
    setNfcStep("verifying");
    setNfcError("");
    try {
      const response = await loginByUid(detectedUid, nfcPin);
      if (response.success) {
        setNfcStep("success");
        toast.success("NFC login successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      if (err?.data?.pinRequired) {
        setNfcStep("pin_entry");
        setNfcError("PIN is required for this card");
      } else {
        setNfcStep("pin_entry");
        setNfcPin("");
        setNfcError(err?.message || "Invalid PIN — try again");
      }
    }
  };

  // Link an unregistered card to user's account
  const handleLinkCard = async () => {
    if (!detectedUid) return;
    if (!linkEmail || !linkPassword) {
      toast.error("Enter your email and password to link this card");
      return;
    }
    if (!nfcPin || nfcPin.length < 4) {
      toast.error("Create a 4-digit PIN for your card");
      return;
    }
    if (nfcPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }
    setIsLinking(true);
    try {
      const res = await linkCard({
        identifier: linkEmail,
        password: linkPassword,
        cardUid: detectedUid,
        pin: nfcPin,
      });
      if (res.success) {
        setNfcStep("success");
        toast.success("Card linked & logged in!");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        throw new Error(res.message || "Failed to link card");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to link card. Check your credentials.");
    } finally {
      setIsLinking(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (loginMethod === "email") {
      if (!formData.email) {
        toast.error("Email is required");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }
    } else if (loginMethod === "phone") {
      if (!phone || phone.length < 8) {
        toast.error("Please enter a valid phone number");
        return false;
      }
    }

    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { apiFetch } = await import("../../lib/api");
      const identifier = loginMethod === "email" ? formData.email : phone;
      const data: any = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: formData.password }),
      });

      if (data.token) {
        try {
          localStorage.setItem("auth_token", data.token);
        } catch (e) {}
      }

      toast.success(data.message || "Login successful! Redirecting...");
      // Redirect to the local dashboard route
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      console.error("Login api error:", err);
      toast.error(
        err?.message ||
          err?.text ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div
      className="relative min-h-screen w-full text-gray-200 flex flex-col"
      style={{
        fontFamily: "Inter, sans-serif",
        background: "#0A1A2F",
      }}
    >
      {/* Corner glow effects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 220,
            height: 220,
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.35) 0%, rgba(69,79,187,0.18) 45%, rgba(69,79,187,0.0) 70%)",
            filter: "blur(18px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -140,
            width: 540,
            height: 540,
            background:
              "radial-gradient(closest-side, rgba(69,79,187,0.14), rgba(69,79,187,0))",
            filter: "blur(12px)",
          }}
        />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

            /* Custom styles for react-international-phone */
            .react-international-phone-input-container {
              width: 100%;
            }

            .react-international-phone-input-container .react-international-phone-input {
              height: 48px !important;
              width: 100% !important;
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 0 8px 8px 0 !important;
              color: #e2e8f0 !important;
              font-size: 14px !important;
            }

            .react-international-phone-input-container .react-international-phone-input:focus {
              outline: none !important;
              box-shadow: 0 0 0 2px #3b82f6 !important;
            }

            .react-international-phone-input-container .react-international-phone-input::placeholder {
              color: #64748b !important;
            }

            .react-international-phone-country-selector-button {
              height: 48px !important;
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 8px 0 0 8px !important;
              border-right: none !important;
              padding: 0 12px !important;
            }

            .react-international-phone-country-selector-button:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown {
              background-color: #1e293b !important;
              border: 1px solid #334155 !important;
              border-radius: 8px !important;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
              max-height: 300px !important;
              z-index: 9999 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item {
              padding: 10px 12px !important;
              color: #e2e8f0 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item:hover {
              background-color: #334155 !important;
            }

            .react-international-phone-country-selector-dropdown__list-item--selected {
              background-color: #3b82f6 !important;
              color: white !important;
            }

            .react-international-phone-dial-code-preview {
              color: #e2e8f0 !important;
            }

            /* Mobile responsive styles */
            @media (max-width: 768px) {
              .mobile-container {
                margin: 0 16px;
              }
              .mobile-form {
                padding: 24px 16px !important;
              }
              .mobile-title {
                font-size: 24px !important;
                margin-left: 0 !important;
              }
              .mobile-subtitle {
                margin-left: 0 !important;
              }
              .mobile-input-container {
                margin-left: 0 !important;
              }
              .mobile-button {
                margin-left: 0 !important;
              }
            }
          `,
        }}
      />

      {/* Logo */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <img
          src="/logo.png"
          alt="Summit Exchange Logo"
          className="h-16 w-auto mb-4"
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-2 sm:p-6 py-8 sm:py-24">
        <div className="w-full max-w-3xl bg-[#10233D] backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 overflow-hidden mb-16 mobile-container">
          {/* Form Section */}
          <div
            className="p-8 rounded-l-2xl mobile-form"
            style={{ marginTop: "30px" }}
          >
            <h1
              className="text-3xl font-bold text-white mb-2 mobile-title"
              style={{ marginLeft: "20px" }}
            >
              Login to your account
            </h1>
            <p
              className="text-gray-400 text-sm mb-8 mobile-subtitle"
              style={{ marginLeft: "20px" }}
            >
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-blue-400 hover:underline"
              >
                Sign up
              </a>
            </p>

            {/* ===== NFC QUICK LOGIN (PRIMARY METHOD) ===== */}
            <div
              className="mb-6 mobile-input-container"
              style={{ marginLeft: "15px", marginRight: "15px" }}
            >
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-blue-900/20 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">NFC Quick Login</h3>
                    <p className="text-gray-400 text-xs">
                      {bridgeConnected
                        ? `Bridge connected${bridgeStatus?.reader ? ` — ${bridgeStatus.reader}` : ''} — tap your card`
                        : keyboardListening
                        ? "Reader ready — tap your card to login instantly"
                        : readerConnected
                        ? "Reader connected — tap your card to login instantly"
                        : "Tap your card — no password needed"}
                    </p>
                  </div>
                  {/* Reader status dot */}
                  <div className="ml-auto flex items-center gap-2">
                    {bridgeConnected && (
                      <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Bridge</span>
                    )}
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      bridgeConnected ? "bg-emerald-400 animate-pulse" : (readerConnected || keyboardListening) ? "bg-emerald-400 animate-pulse" : "bg-slate-600"
                    )} title={bridgeConnected ? "NFC Bridge connected" : keyboardListening ? "Keyboard NFC capture active" : readerConnected ? "WebHID reader connected" : "Reader not connected"} />
                  </div>
                </div>

                {nfcStep === "idle" && (
                  <div className="space-y-3">
                    {bridgeConnected && (
                      <p className="text-emerald-400/80 text-xs text-center animate-pulse">
                        NFC Bridge active — tap your card on the CYB reader to login
                      </p>
                    )}
                    {!bridgeConnected && keyboardListening && (
                      <p className="text-emerald-400/80 text-xs text-center animate-pulse">
                        NFC reader active — tap your card anytime to login
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleNfcTapLogin}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 rounded-lg text-sm transition-colors shadow-lg shadow-emerald-600/20"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 01-8 0" />
                      </svg>
                      {bridgeConnected ? "Tap Your NFC Card Now" : keyboardListening ? "Tap Your NFC Card Now" : readerConnected ? "Tap Your NFC Card Now" : "Connect NFC Reader & Login"}
                    </button>
                    {!bridgeConnected && !hasWebHid && !keyboardListening && (
                      <p className="text-amber-400/80 text-xs text-center">
                        WebHID not supported — use Chrome or Edge browser
                      </p>
                    )}
                    {!bridgeConnected && (
                      <a
                        href="/nfc-setup"
                        className="block text-center text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1"
                      >
                        ⬇ Download NFC Service for Windows
                      </a>
                    )}
                  </div>
                )}

                {nfcStep === "connecting" && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-emerald-400 font-medium mt-3">Connecting to NFC reader...</p>
                    <p className="text-gray-500 text-xs mt-1">Select your reader in the browser popup</p>
                  </div>
                )}

                {nfcStep === "waiting" && (
                  <div className="text-center py-4">
                    <div className="relative inline-block">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <line x1="2" y1="10" x2="22" y2="10" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                    <p className="text-emerald-400 font-medium mt-3">Tap your NFC card on the reader...</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {bridgeConnected ? "NFC Bridge active — tap your card on the reader" : keyboardListening ? "Keyboard capture active — just tap your card" : "Reader is ready — waiting for card"}
                    </p>
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-1.5 bg-slate-700/50 hover:bg-slate-600 text-gray-400 rounded-lg text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {nfcStep === "verifying" && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-blue-400 font-medium mt-3">Verifying PIN...</p>
                    {detectedUid && (
                      <p className="text-gray-500 text-xs mt-1 font-mono">UID: {detectedUid}</p>
                    )}
                  </div>
                )}

                {nfcStep === "checking" && (
                  <div className="text-center py-4">
                    <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-emerald-400 font-medium mt-3">Card detected! Checking...</p>
                  </div>
                )}

                {nfcStep === "pin_entry" && (
                  <div className="text-center py-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <p className="text-emerald-400 font-semibold mt-2">Enter Your PIN</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">Enter your 4-digit PIN to login</p>
                    {nfcError && <p className="text-red-400 text-xs mb-3">{nfcError}</p>}
                    <div className="max-w-[200px] mx-auto space-y-3">
                      <Input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="● ● ● ●"
                        value={nfcPin}
                        onChange={(e) => setNfcPin(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handlePinSubmit(); }}
                        autoFocus
                        className="text-center text-xl tracking-[0.5em]"
                      />
                      <button
                        type="button"
                        onClick={handlePinSubmit}
                        disabled={nfcPin.length < 4}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-gray-500 text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        Login
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-1.5 text-gray-400 hover:text-gray-200 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {nfcStep === "create_pin" && (
                  <div className="text-center py-4">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                      <line x1="12" y1="15" x2="12" y2="18" />
                    </svg>
                    <p className="text-amber-400 font-semibold mt-2">New Card — Set Up Your PIN</p>
                    <p className="text-gray-400 text-xs mt-1 mb-4">
                      Link your account and create a 4-digit PIN.<br />You will need this PIN every time you tap.
                    </p>

                    <div className="space-y-3 text-left max-w-xs mx-auto">
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={linkEmail}
                        onChange={(e) => setLinkEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                      />
                      <Input
                        type="password"
                        placeholder="Account password"
                        value={linkPassword}
                        onChange={(e) => setLinkPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                      <div className="pt-2 border-t border-slate-700">
                        <p className="text-gray-400 text-xs mb-2 text-center">Create your card PIN</p>
                      </div>
                      <Input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="Create PIN (4-6 digits)"
                        value={nfcPin}
                        onChange={(e) => setNfcPin(e.target.value.replace(/\D/g, ''))}
                        className="text-center text-lg tracking-[0.4em]"
                      />
                      <Input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="Confirm PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleLinkCard(); }}
                        className="text-center text-lg tracking-[0.4em]"
                      />
                      {nfcPin && confirmPin && nfcPin !== confirmPin && (
                        <p className="text-red-400 text-xs text-center">PINs do not match</p>
                      )}
                      <button
                        type="button"
                        onClick={handleLinkCard}
                        disabled={isLinking || nfcPin.length < 4 || nfcPin !== confirmPin || !linkEmail || !linkPassword}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-gray-500 text-white font-semibold rounded-lg text-sm transition-colors"
                      >
                        {isLinking ? "Linking..." : "Create PIN & Login"}
                      </button>
                    </div>

                    {detectedUid && (
                      <p className="text-gray-600 text-xs mt-3 font-mono">Card: {detectedUid}</p>
                    )}
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-1.5 text-gray-400 hover:text-gray-200 text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {nfcStep === "success" && (
                  <div className="text-center py-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <p className="text-emerald-400 font-semibold mt-3">Login Successful!</p>
                    <p className="text-gray-500 text-xs mt-1">Redirecting to dashboard...</p>
                  </div>
                )}

                {nfcStep === "error" && (
                  <div className="text-center py-4">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <p className="text-red-400 font-medium mt-3">{nfcError}</p>
                    <button
                      type="button"
                      onClick={resetNfcLogin}
                      className="mt-3 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Divider between NFC and traditional login */}
            <div
              className="flex items-center gap-3 mb-6 mobile-input-container"
              style={{ marginLeft: "15px", marginRight: "15px" }}
            >
              <div className="flex-1 h-px bg-slate-700" />
              <span className="text-gray-500 text-xs uppercase tracking-wide">Or login with password</span>
              <div className="flex-1 h-px bg-slate-700" />
            </div>

            {/* Login Method Toggle */}
            <div
              className="flex gap-3 mb-6 mobile-input-container"
              style={{ marginLeft: "15px" }}
            >
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                  loginMethod === "email"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300 border border-slate-700",
                )}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors",
                  loginMethod === "phone"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-gray-300 border border-slate-700",
                )}
              >
                Phone
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email or Phone Input */}
              {loginMethod === "email" ? (
                <div
                  className="mobile-input-container"
                  style={{ marginLeft: "15px", marginTop: "30px" }}
                >
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    style={{ paddingLeft: "15px", width: "100%" }}
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              ) : (
                <div
                  className="mobile-input-container"
                  style={{ marginLeft: "15px", marginTop: "30px" }}
                >
                  <PhoneInput
                    defaultCountry="sg"
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    placeholder="Enter phone number"
                    disabled={isLoading}
                  />
                </div>
              )}

              {/* Password Input */}
              <div
                className="relative mobile-input-container"
                style={{ marginLeft: "15px", marginTop: "30px" }}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="pr-12"
                  style={{ paddingLeft: "15px", width: "100%" }}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold h-12 rounded-lg text-base hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 mobile-button"
                style={{ marginTop: "20px", marginLeft: "10px" }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              {/* Forgot Password Link */}
              <div
                className="text-center pt-2"
                style={{ marginLeft: "10px", marginBottom: "30px" }}
              >
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium bg-transparent border-none cursor-pointer transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>

          {/* Image Section */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-r-2xl">
            <img
              src="/login.png"
              alt="Summit Exchange Login"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1E293B",
          color: "#F1F5F9",
          border: "1px solid #475569",
        }}
      />
    </div>
  );
}
