"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Download,
  Monitor,
  Usb,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Download Summit NFC Service",
    description:
      'Click the download button below to get SummitNfcService.exe. This lightweight app (~28 MB) runs in your system tray and connects your NFC reader to the Summit Exchange platform.',
  },
  {
    icon: ShieldCheck,
    title: "Run as Administrator",
    description:
      'Right-click the downloaded file and select "Run as administrator". Windows may show a SmartScreen warning — click "More info" → "Run anyway". The app needs admin access to communicate with your USB NFC reader.',
  },
  {
    icon: Usb,
    title: "Connect Your NFC Reader",
    description:
      "Plug your CYB NFC reader into any USB port. The tray icon will turn green when the reader is detected. If the icon stays red, try a different USB port.",
  },
  {
    icon: CreditCard,
    title: "Tap Your Card",
    description:
      "Place your Summit NFC card on the reader. The browser will automatically detect the card and log you in or authorize your transaction. No passwords needed.",
  },
];

const faqs = [
  {
    q: "Is the NFC Service safe to install?",
    a: 'Yes. The Summit NFC Service only communicates with your local NFC reader and the Summit Exchange website. It does not collect personal data, access your files, or connect to third-party servers. The source code is included in the download.',
  },
  {
    q: "Why does it need administrator access?",
    a: "Administrator privileges are required to access USB HID devices (your NFC reader) on Windows. Without admin access, the app cannot read cards from the reader.",
  },
  {
    q: "Windows SmartScreen is blocking the download",
    a: 'This happens because the executable is not yet code-signed with an EV certificate. Click "More info" on the SmartScreen popup, then click "Run anyway". The app is safe to use.',
  },
  {
    q: "The tray icon is red / reader not detected",
    a: "Make sure your CYB NFC reader is plugged in via USB. Try a different USB port. If using a USB hub, connect directly to the laptop. Restart the app after plugging in the reader.",
  },
  {
    q: "Can I use this on Mac or Linux?",
    a: "Currently the NFC Service is Windows-only. Mac and Linux support is planned for a future release.",
  },
  {
    q: "How do I enable auto-start?",
    a: 'Right-click the Summit NFC tray icon in your system tray and select "Enable Auto-Start". The service will launch automatically when you log into Windows.',
  },
];

export default function NfcSetupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    // Trigger download from public folder
    const link = document.createElement("a");
    link.href = "/SummitNfcService.exe";
    link.download = "SummitNfcService.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-100">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-28 pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
            <Monitor className="w-4 h-4" />
            Windows Desktop App
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
            Summit NFC Service
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
            A lightweight system tray app that connects your NFC reader to
            Summit Exchange. Download, run, tap your card — that&apos;s it.
          </p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
              boxShadow: "0 4px 24px rgba(34, 197, 94, 0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(34, 197, 94, 0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 24px rgba(34, 197, 94, 0.35)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Download className="w-6 h-6" />
            {downloading ? "Downloading..." : "Download for Windows"}
            <span className="text-sm font-normal opacity-75">~28 MB</span>
          </button>

          <p className="mt-4 text-xs text-gray-500">
            v1.0.0 &middot; Windows 10/11 &middot; Requires administrator
            privileges
          </p>
        </div>
      </section>

      {/* Admin Warning Banner */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="flex items-start gap-4 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-300 mb-1">
              Run as Administrator Required
            </h3>
            <p className="text-sm text-gray-400">
              After downloading, right-click{" "}
              <span className="text-gray-200 font-mono">SummitNfcService.exe</span>{" "}
              and select{" "}
              <span className="text-amber-300 font-medium">
                &quot;Run as administrator&quot;
              </span>
              . This is required to access your USB NFC reader. Windows
              SmartScreen may block the first run — click &quot;More info&quot; →
              &quot;Run anyway&quot;.
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-center mb-12">
          Setup in 4 Simple Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                {i + 1}
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-700/50 group-hover:bg-blue-500/10 transition-colors">
                  <step.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What happens section */}
      <section className="max-w-4xl mx-auto px-4 mb-20">
        <div className="p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl mb-2">🔌</div>
              <p className="text-sm text-gray-300 font-medium">Reader plugs into USB</p>
              <p className="text-xs text-gray-500 mt-1">
                Tray icon turns green
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl mb-2">💳</div>
              <p className="text-sm text-gray-300 font-medium">Tap card on reader</p>
              <p className="text-xs text-gray-500 mt-1">
                UID sent to browser instantly
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-700/30">
              <div className="text-3xl mb-2">✅</div>
              <p className="text-sm text-gray-300 font-medium">
                Auto login or authorize
              </p>
              <p className="text-xs text-gray-500 mt-1">
                No passwords, no codes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-700/50 bg-slate-800/30 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-700/20 transition-colors"
              >
                <span className="font-medium text-gray-200">{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-slate-700/30 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 mb-16 text-center">
        <p className="text-gray-400 mb-4">
          Don&apos;t have an NFC card yet?
        </p>
        <Link href="/nfc-access">
          <button className="px-6 py-3 rounded-lg border border-blue-500/40 bg-blue-500/10 text-blue-400 font-medium hover:bg-blue-500/20 transition-colors">
            🔐 Get Your NFC Card
          </button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
