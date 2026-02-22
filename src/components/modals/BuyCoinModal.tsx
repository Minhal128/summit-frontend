"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ArrowLeft, X, CreditCard, Shield, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/WalletContext"
import NfcTransactionAuth from "./NfcTransactionAuth"
import { getStoredCardId } from "@/lib/nfcApi"

interface BuyCoinModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: () => void
}

export default function BuyCoinModal({ isOpen, onClose, onBack, selectedToken, onProceed }: BuyCoinModalProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-debit")
  const [showNfcAuth, setShowNfcAuth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { balances } = useWallet()
  const cardId = getStoredCardId()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setError(null)
    }
  }, [isOpen])

  const getTokenIcon = (token?: string) => {
    switch (token) {
      case "BTC":
        return "₿"
      case "ETH":
        return "Ξ"
      case "SOL":
        return "◎"
      case "TON":
        return "💎"
      case "USDT":
        return "₮"
      default:
        return "₿"
    }
  }

  const getTokenColor = (token?: string) => {
    switch (token) {
      case "BTC":
        return "bg-orange-500"
      case "ETH":
        return "bg-blue-500"
      case "SOL":
        return "bg-black"
      case "TON":
        return "bg-blue-600"
      case "USDT":
        return "bg-green-500"
      default:
        return "bg-orange-500"
    }
  }

  const getTokenName = (token?: string) => {
    const names: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      SOL: "Solana",
      TON: "Toncoin",
      USDT: "Tether USD"
    }
    return names[token || ''] || token
  }

  const handleProceed = () => {
    setError(null)
    
    // Validate amount
    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Check if NFC card is linked
    if (!cardId) {
      setError("No NFC card linked. Please link your card in settings.")
      return
    }

    // Show NFC auth
    setShowNfcAuth(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Buy coin</DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-right">
            <label className="text-sm text-gray-400 block mb-2">Amount (USD)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError(null)
              }}
              placeholder="0.00"
              className="bg-transparent border-none text-right text-2xl font-bold text-green-400 placeholder:text-gray-600 p-0 h-auto focus-visible:ring-0"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Select defaultValue={selectedToken?.toLowerCase()}>
              <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white h-16 px-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${getTokenColor(selectedToken)} rounded-full flex items-center justify-center font-bold text-white text-lg`}
                  >
                    {getTokenIcon(selectedToken)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">{selectedToken}</p>
                    <p className="text-sm text-gray-400">{getTokenName(selectedToken)}</p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-slate-700">
                <SelectItem value="btc">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ₿
                    </div>
                    <span>Bitcoin</span>
                  </div>
                </SelectItem>
                <SelectItem value="eth">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      Ξ
                    </div>
                    <span>Ethereum</span>
                  </div>
                </SelectItem>
                <SelectItem value="sol">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ◎
                    </div>
                    <span>Solana</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdt">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ₮
                    </div>
                    <span>USDT</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white h-16 px-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-yellow-500" />
                  <div className="text-left">
                    <p className="font-medium text-base">Pay with</p>
                    <p className="text-sm text-gray-400">
                      {paymentMethod === "credit-debit" ? "Credit card / Debit card" : 
                       paymentMethod === "bank-transfer" ? "Bank Transfer" : "PayPal"}
                    </p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-slate-700">
                <SelectItem value="credit-debit">Credit card / Debit card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleProceed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-base"
          >
            <Shield className="mr-2 h-4 w-4" />
            Proceed (NFC Required)
          </Button>

          {!cardId && (
            <p className="text-yellow-400 text-xs text-center">
              ⚠️ No NFC card linked. Link your card to enable purchases.
            </p>
          )}
        </div>
      </DialogContent>

      {/* NFC Authorization Modal */}
      {cardId && (
        <NfcTransactionAuth
          isOpen={showNfcAuth}
          onClose={() => setShowNfcAuth(false)}
          cardId={cardId}
          actionType="buy"
          actionData={{
            amount: parseFloat(amount) || 0,
            token: selectedToken || 'ETH',
            paymentMethod
          }}
          onAuthorized={(actionPayload) => {
            console.log('Buy authorized:', actionPayload)
            setShowNfcAuth(false)
            onProceed()
          }}
          onError={(error) => {
            console.error('NFC authorization error:', error)
            setError(error)
            setShowNfcAuth(false)
          }}
        />
      )}
    </Dialog>
  )
}
