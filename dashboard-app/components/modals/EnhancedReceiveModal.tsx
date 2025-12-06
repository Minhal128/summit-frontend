"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  X,
  QrCode,
  Copy,
  Check,
  Share2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ArrowLeft
} from "lucide-react"
import { generateReceiveQRCode, formatCryptoAmount, type QRCodeResponse } from "@/lib/transactionApi"

interface EnhancedReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onBack?: () => void
  walletId: string
  wallets?: Array<{
    id: string
    currency: string
    network: string
    address: string
    balance?: string
  }>
}

export default function EnhancedReceiveModal({
  isOpen,
  onClose,
  onBack,
  walletId,
  wallets = []
}: EnhancedReceiveModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string>(walletId)
  const [amount, setAmount] = useState("")
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showWalletSelect, setShowWalletSelect] = useState(false)

  // Fetch QR code when wallet changes
  useEffect(() => {
    if (!isOpen || !selectedWallet) return

    const fetchQRCode = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await generateReceiveQRCode(
          selectedWallet,
          amount || undefined
        )
        setQrData(response)
      } catch (err: any) {
        console.error("Failed to generate QR code:", err)
        setError(err.message || "Failed to generate QR code")
        setQrData(null)
      } finally {
        setLoading(false)
      }
    }

    // Debounce amount changes
    const debounce = setTimeout(fetchQRCode, 300)
    return () => clearTimeout(debounce)
  }, [isOpen, selectedWallet, amount])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAmount("")
      setQrData(null)
      setError(null)
      setCopied(false)
    }
  }, [isOpen])

  // Copy address to clipboard
  const handleCopyAddress = async () => {
    if (!qrData?.wallet.address) return

    try {
      await navigator.clipboard.writeText(qrData.wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Share address
  const handleShare = async () => {
    if (!qrData?.wallet.address) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receive ${qrData.wallet.currency}`,
          text: `My ${qrData.wallet.currency} address: ${qrData.wallet.address}`,
          url: qrData.uri
        })
      } catch (err) {
        console.error("Failed to share:", err)
      }
    } else {
      // Fallback to copy
      handleCopyAddress()
    }
  }

  // Get current wallet details
  const currentWallet = wallets.find(w => w.id === selectedWallet) || {
    id: selectedWallet,
    currency: qrData?.wallet.currency || 'Crypto',
    network: qrData?.wallet.network || 'Network',
    address: qrData?.wallet.address || ''
  }

  // Token colors
  const TOKEN_COLORS: Record<string, string> = {
    BTC: 'from-orange-500 to-yellow-500',
    ETH: 'from-purple-500 to-blue-500',
    USDT: 'from-green-500 to-teal-500',
    USDC: 'from-blue-500 to-cyan-500',
    TRX: 'from-red-500 to-pink-500',
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <DialogTitle className="flex items-center gap-2 text-xl">
                <QrCode className="w-5 h-5 text-green-400" />
                Receive Crypto
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 mt-1">
            Share your wallet address to receive cryptocurrency
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-5">
          {/* Wallet Selector */}
          {wallets.length > 1 && (
            <div className="relative">
              <label className="text-gray-400 text-sm block mb-2">Select Wallet</label>
              <button
                onClick={() => setShowWalletSelect(!showWalletSelect)}
                className="w-full flex items-center justify-between bg-slate-800 border border-slate-600 rounded-lg p-3 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${TOKEN_COLORS[currentWallet.currency] || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                    {currentWallet.currency.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{currentWallet.currency}</p>
                    <p className="text-gray-400 text-xs">{currentWallet.network}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showWalletSelect ? 'rotate-180' : ''}`} />
              </button>

              {showWalletSelect && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => {
                        setSelectedWallet(wallet.id)
                        setShowWalletSelect(false)
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors"
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r ${TOKEN_COLORS[wallet.currency] || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                        {wallet.currency.charAt(0)}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-white font-medium">{wallet.currency}</p>
                        <p className="text-gray-400 text-xs">{wallet.network}</p>
                      </div>
                      {wallet.balance && (
                        <p className="text-gray-400 text-sm">{formatCryptoAmount(wallet.balance)}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 flex items-center justify-center mx-auto" style={{ width: 'fit-content' }}>
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="w-48 h-48 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            ) : qrData?.qrCode ? (
              <img
                src={qrData.qrCode}
                alt="QR Code"
                className="w-48 h-48"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl">
                <QrCode className="w-16 h-16 text-gray-300" />
              </div>
            )}
          </div>

          {/* Request Amount (Optional) */}
          <div>
            <label className="text-gray-400 text-sm block mb-2">Request Amount (Optional)</label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-600 text-white pr-16"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {currentWallet.currency}
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Specify an amount to include in the QR code
            </p>
          </div>

          {/* Address Display */}
          {(qrData?.wallet.address || currentWallet.address) && (
            <div>
              <label className="text-gray-400 text-sm block mb-2">Wallet Address</label>
              <div className="bg-slate-800 rounded-xl p-4">
                <p className="text-white font-mono text-sm break-all mb-3">
                  {qrData?.wallet.address || currentWallet.address}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopyAddress}
                    className="flex-1 bg-slate-700 hover:bg-slate-600"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Address
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-slate-600 text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Network Info */}
          <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Network</span>
              <span className="text-white">{currentWallet.network}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Currency</span>
              <span className="text-white">{currentWallet.currency}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-lg text-sm">
            <p className="font-semibold mb-1">Important</p>
            <p className="text-yellow-400/80">
              Only send {currentWallet.currency} to this address. Sending other tokens may result in permanent loss.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
