"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  CreditCard,
  ShieldCheck,
  Loader,
  CheckCircle,
  AlertCircle,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const ActivateCardPage = () => {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [activating, setActivating] = useState(false);
  const [cardData, setCardData] = useState<{
    cardId: string;
    cardUid: string;
  } | null>(null);
  const [activationProgress, setActivationProgress] = useState({
    step: "",
    message: "",
    progress: 0,
    crypto: "",
  });
  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://king-prawn-app-nv72k.ondigitalocean.app",
      {
        transports: ["websocket", "polling"],
        withCredentials: true,
      },
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("activation-progress", (data) => {
      console.log("Progress update:", data);
      setActivationProgress({
        step: data.step,
        message: data.message,
        progress: data.progress || 0,
        crypto: data.crypto || "",
      });

      // Show toast for major milestones
      if (data.step === "validating") {
        toast.info("🔍 " + data.message);
      } else if (data.step === "activating") {
        toast.info("🔐 " + data.message);
      } else if (data.step === "generating-wallets") {
        toast.info("💼 " + data.message);
      } else if (data.step === "wallet-created") {
        toast.success(`✅ ${data.crypto.toUpperCase()} wallets created!`);
      } else if (data.step === "completed") {
        toast.success("🎉 " + data.message);
      }
    });

    socket.on("activation-error", (data) => {
      toast.error("❌ " + data.message);
      setActivating(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleNFCScan = async () => {
    setScanning(true);

    try {
      // Check if Web NFC is supported
      if (!("NDEFReader" in window)) {
        // Fallback: show manual input for desktop users
        toast.error(
          "NFC is not supported on this device/browser. Use Chrome on Android, or enter card details manually below.",
        );
        setScanning(false);
        return;
      }

      const ndef = new (window as any).NDEFReader();

      toast.info("Hold your NFC card near your device...");

      await ndef.scan();

      ndef.addEventListener("reading", ({ message, serialNumber }: any) => {
        console.log("NFC Tag detected!");
        console.log("Serial Number:", serialNumber);

        // Read the card ID from NFC tag (written during provisioning)
        let cardId = "";
        for (const record of message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder(record.encoding || "utf-8");
            cardId = textDecoder.decode(record.data);
            break;
          }
        }

        // Use serial number as UID
        const cardUid = serialNumber
          ? serialNumber.replace(/:/g, "").toUpperCase()
          : "";

        if (!cardId) {
          // Card has no NDEF text record - use UID-based fallback
          cardId = `NFC-${cardUid || Date.now()}`;
          toast.info("Card detected but no Summit ID found. Using UID-based ID.");
        }

        setCardData({
          cardId,
          cardUid,
        });

        setScanning(false);
        toast.success("Card detected!");
      });

      ndef.addEventListener("readingerror", () => {
        toast.error("Error reading NFC card. Please try again.");
        setScanning(false);
      });
    } catch (error: any) {
      console.error("NFC Scan error:", error);
      toast.error(error.message || "Failed to scan NFC card");
      setScanning(false);
    }
  };

  const handleActivateCard = async () => {
    if (!cardData) {
      toast.error("No card data available");
      return;
    }

    if (!socketRef.current?.id) {
      toast.error("Connection not established. Please refresh the page.");
      return;
    }

    setActivating(true);
    setActivationProgress({
      step: "starting",
      message: "Starting activation...",
      progress: 0,
      crypto: "",
    });

    try {
      const token = localStorage.getItem("token");

      // Build headers
      const headers: any = {
        "Content-Type": "application/json",
      };

      // Add auth token if available (optional for testing)
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.log("⚠️  No token found - activating in TEST MODE");
        toast.info("🧪 Activating in test mode (no authentication)");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nfc-card/activate`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            ...cardData,
            socketId: socketRef.current.id,
          }),
        },
      );

      const data = await response.json();

      if (data.status === "success") {
        // Wait a moment for final progress update
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirect to dashboard
        }, 2000);
      } else {
        toast.error(data.message || "Failed to activate card");
        setActivating(false);
      }
    } catch (error: any) {
      console.error("Activation error:", error);
      toast.error(error.message || "Failed to activate card");
      setActivating(false);
    }
  };

  // Manual card entry for desktop/reader users
  const [manualCardId, setManualCardId] = useState("");
  const [manualCardUid, setManualCardUid] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleManualEntry = () => {
    if (!manualCardId.trim() || !manualCardUid.trim()) {
      toast.error("Both Card ID and Card UID are required");
      return;
    }
    setCardData({
      cardId: manualCardId.trim(),
      cardUid: manualCardUid.trim(),
    });
    toast.success("Card data entered!");
  };

  // Simulate NFC scan for testing (remove in production)
  const handleTestScan = () => {
    const testCardData = {
      cardId: `NFC-TEST-${Date.now()}`,
      cardUid: crypto.randomUUID().split("-")[0].toUpperCase(),
    };

    setCardData(testCardData);
    toast.success("Test card detected!");
  };

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#0A1A2F",
        color: "#EBE2FF",
        minHeight: "100vh",
        paddingTop: "70px",
      }}
    >
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: "60px 20px 40px",
          background:
            "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(0, 59, 252, 0.05) 100%)",
          borderBottom: "1px solid rgba(235, 226, 255, 0.1)",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #4CAF50, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Activate Your NFC Card
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(235, 226, 255, 0.7)",
              marginBottom: "0",
            }}
          >
            Scan your NFC card to access your crypto dashboard
          </p>
        </div>
      </section>

      <div
        style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(235, 226, 255, 0.1)",
            borderRadius: "16px",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          {!cardData ? (
            <>
              {/* Scan Card Section */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: "rgba(76, 175, 80, 0.2)",
                  border: "3px solid rgba(76, 175, 80, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                }}
              >
                {scanning ? (
                  <Loader
                    size={60}
                    style={{
                      color: "#4CAF50",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                ) : (
                  <CreditCard size={60} style={{ color: "#4CAF50" }} />
                )}
              </div>

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "16px",
                }}
              >
                {scanning ? "Scanning..." : "Ready to Scan"}
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  color: "rgba(235, 226, 255, 0.7)",
                  marginBottom: "40px",
                  lineHeight: "1.6",
                }}
              >
                {scanning
                  ? "Hold your NFC card near your device..."
                  : "Click the button below and hold your physical NFC card near your device to activate it."}
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <button
                  onClick={handleNFCScan}
                  disabled={scanning}
                  style={{
                    padding: "18px 40px",
                    background: scanning
                      ? "rgba(150, 150, 150, 0.3)"
                      : "linear-gradient(45deg, #4CAF50, #003BFC)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: scanning ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: scanning
                      ? "none"
                      : "0 4px 20px rgba(76, 175, 80, 0.4)",
                  }}
                  onMouseEnter={(e) => {
                    if (!scanning) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 30px rgba(76, 175, 80, 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!scanning) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(76, 175, 80, 0.4)";
                    }
                  }}
                >
                  {scanning ? "Scanning..." : "Scan NFC Card"}
                </button>

                {/* Test button for development */}
                <button
                  onClick={handleTestScan}
                  style={{
                    padding: "14px 32px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(235, 226, 255, 0.2)",
                    borderRadius: "12px",
                    color: "rgba(235, 226, 255, 0.7)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Test Mode (Development Only)
                </button>

                {/* Manual entry for desktop/reader users */}
                <button
                  onClick={() => setShowManualEntry(!showManualEntry)}
                  style={{
                    padding: "14px 32px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(235, 226, 255, 0.15)",
                    borderRadius: "12px",
                    color: "rgba(235, 226, 255, 0.6)",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Enter Card Details Manually
                </button>
              </div>

              {/* Manual Entry Form */}
              {showManualEntry && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "24px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(235, 226, 255, 0.15)",
                    borderRadius: "12px",
                    textAlign: "left",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(235, 226, 255, 0.7)",
                      marginBottom: "16px",
                    }}
                  >
                    Enter the details from your provisioned card (shown in the
                    provisioning tool output):
                  </p>
                  <div style={{ marginBottom: "12px" }}>
                    <label
                      style={{
                        fontSize: "13px",
                        color: "rgba(235, 226, 255, 0.6)",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Card ID (e.g., SUMMIT-EV3-A1B2C3D4)
                    </label>
                    <input
                      type="text"
                      value={manualCardId}
                      onChange={(e) => setManualCardId(e.target.value)}
                      placeholder="SUMMIT-EV3-XXXXXXXX"
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(235, 226, 255, 0.2)",
                        borderRadius: "8px",
                        color: "#EBE2FF",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        fontSize: "13px",
                        color: "rgba(235, 226, 255, 0.6)",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Card UID (7-byte hex from reader)
                    </label>
                    <input
                      type="text"
                      value={manualCardUid}
                      onChange={(e) => setManualCardUid(e.target.value)}
                      placeholder="04A1B2C3D4E5F6"
                      style={{
                        width: "100%",
                        padding: "12px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(235, 226, 255, 0.2)",
                        borderRadius: "8px",
                        color: "#EBE2FF",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        outline: "none",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleManualEntry}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "linear-gradient(45deg, #4CAF50, #003BFC)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Submit Card Details
                  </button>
                </div>
              )}

              <div
                style={{
                  marginTop: "40px",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(235, 226, 255, 0.1)",
                  borderRadius: "12px",
                }}
              >
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "13px",
                    color: "rgba(235, 226, 255, 0.7)",
                  }}
                >
                  <ShieldCheck size={18} style={{ color: "#4CAF50" }} />
                  Your card data is encrypted and secure
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Card Detected Section */}
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  background: "rgba(76, 175, 80, 0.2)",
                  border: "3px solid rgba(76, 175, 80, 0.5)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 32px",
                }}
              >
                <CheckCircle size={60} style={{ color: "#4CAF50" }} />
              </div>

              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#4CAF50",
                }}
              >
                Card Detected!
              </h2>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(235, 226, 255, 0.1)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "32px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(235, 226, 255, 0.6)",
                    marginBottom: "8px",
                  }}
                >
                  Card ID:
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "monospace",
                  }}
                >
                  {cardData.cardId}
                </p>

                <p
                  style={{
                    fontSize: "14px",
                    color: "rgba(235, 226, 255, 0.6)",
                    marginTop: "16px",
                    marginBottom: "8px",
                  }}
                >
                  Card UID:
                </p>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    fontFamily: "monospace",
                  }}
                >
                  {cardData.cardUid}
                </p>
              </div>

              {/* Progress Section */}
              {activating && activationProgress.step && (
                <div
                  style={{
                    background: "rgba(76, 175, 80, 0.1)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#4CAF50",
                      }}
                    >
                      {activationProgress.message}
                    </p>
                    {activationProgress.crypto && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "rgba(235, 226, 255, 0.7)",
                        }}
                      >
                        Currency: {activationProgress.crypto.toUpperCase()}
                      </p>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: "100%",
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      overflow: "hidden",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: `${activationProgress.progress}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #4CAF50, #00D4FF)",
                        transition: "width 0.3s ease",
                        borderRadius: "4px",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(235, 226, 255, 0.6)",
                      textAlign: "right",
                    }}
                  >
                    {activationProgress.progress}% Complete
                  </p>

                  {/* Wallet Generation Steps */}
                  {activationProgress.step === "wallet-created" && (
                    <div
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Wallet size={16} style={{ color: "#4CAF50" }} />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgba(235, 226, 255, 0.8)",
                        }}
                      >
                        Generated 3 {activationProgress.crypto.toUpperCase()}{" "}
                        wallet addresses
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <button
                  onClick={handleActivateCard}
                  disabled={activating}
                  style={{
                    padding: "18px 40px",
                    background: activating
                      ? "rgba(150, 150, 150, 0.3)"
                      : "linear-gradient(45deg, #4CAF50, #003BFC)",
                    border: "none",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: activating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    transition: "all 0.3s ease",
                    boxShadow: activating
                      ? "none"
                      : "0 4px 20px rgba(76, 175, 80, 0.4)",
                    opacity: activating ? 0.7 : 1,
                  }}
                >
                  {activating && (
                    <Loader
                      size={20}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  )}
                  {activating
                    ? "Generating Wallets..."
                    : "Activate Card & Generate Wallets"}
                </button>

                <button
                  onClick={() => setCardData(null)}
                  disabled={activating}
                  style={{
                    padding: "14px 32px",
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(235, 226, 255, 0.2)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: activating ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    opacity: activating ? 0.5 : 1,
                  }}
                >
                  Scan Different Card
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ActivateCardPage;
