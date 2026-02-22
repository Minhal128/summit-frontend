"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ArrowLeft, X, CreditCard, Loader2, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/contexts/WalletContext"

interface SellCoinModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

export default function SellCoinModal({ isOpen, onClose, onBack, selectedToken, onProceed }: SellCoinModalProps) {
  const { balances } = useWallet()
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank-transfer")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'input' | 'confirm'>('input')

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount("")
      setError(null)
      setIsLoading(false)
      setStep('input')
    }
  }, [isOpen])

  // Get user's balance for selected token
  const getTokenBalance = () => {
    if (!selectedToken) return 0
    const balance = balances.find(b => b.symbol.toUpperCase() === selectedToken.toUpperCase())
    return balance?.amount || 0
  }

  const tokenBalance = getTokenBalance()

  // Calculate USD value
  const getUsdValue = () => {
    const amt = parseFloat(amount) || 0
    const balance = balances.find(b => b.symbol.toUpperCase() === selectedToken?.toUpperCase())
    if (!balance || balance.amount === 0) return 0
    const pricePerUnit = balance.valueUSD / balance.amount
    return amt * pricePerUnit
  }

  const getTokenIcon = (token?: string) => {
    switch (token?.toUpperCase()) {
      case "BTC": return "₿"
      case "ETH": return "Ξ"
      case "SOL": return "◎"
      case "TRX": return "T"
      case "USDT": return "₮"
      default: return token?.charAt(0) || "?"
    }
  }

  const getTokenColor = (token?: string) => {
    switch (token?.toUpperCase()) {
      case "BTC": return "bg-orange-500"
      case "ETH": return "bg-purple-500"
      case "SOL": return "bg-teal-500"
      case "TRX": return "bg-red-500"
      case "USDT": return "bg-green-500"
      default: return "bg-blue-500"
    }
  }

  const getTokenName = (token?: string) => {
    switch (token?.toUpperCase()) {
      case "BTC": return "Bitcoin"
      case "ETH": return "Ethereum"
      case "SOL": return "Solana"
      case "TRX": return "Tron"
      case "USDT": return "Tether"
      default: return token || "Unknown"
    }
  }

  // Validate and proceed to confirmation
  const handleValidateAndProceed = () => {
    setError(null)

    // Validate amount
    const amt = parseFloat(amount)
    if (!amount || amount.trim() === "") {
      setError("Please enter an amount to sell")
      return
    }

    if (isNaN(amt) || amt <= 0) {
      setError("Please enter a valid amount greater than 0")
      return
    }

    if (amt > tokenBalance) {
      setError(`Insufficient balance. You have ${tokenBalance.toFixed(6)} ${selectedToken?.toUpperCase()}`)
      return
    }

    // Minimum sell amount check
    const minAmount = 0.0001
    if (amt < minAmount) {
      setError(`Minimum sell amount is ${minAmount} ${selectedToken?.toUpperCase()}`)
      return
    }

    // Move to confirmation step
    setStep('confirm')
  }

  // Execute the sell transaction
  const handleConfirmSell = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('nfc_token') || localStorage.getItem('auth_token')
      const cardId = localStorage.getItem('nfc_card_id')

      if (!token || !cardId) {
        setError('Please login with your NFC card first')
        setIsLoading(false)
        return
      }

      // Call sell initiate API
      const response = await fetch(`${API_BASE}/api/nfc/transactions/sell/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardUid: cardId,
          cryptocurrency: selectedToken?.toLowerCase(),
          amount: parseFloat(amount),
          payoutMethod: paymentMethod
        })
      })

      const result = await response.json()

      if (result.success || result.status === 'success') {
        // Transaction initiated successfully
        onProceed()
      } else {
        setError(result.message || 'Failed to initiate sell transaction')
      }
    } catch (err: any) {
      console.error('Sell error:', err)
      setError(err.message || 'Transaction failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('input')
      setError(null)
    } else {
      onBack()
    }
  }

  const handleSetMaxAmount = () => {
    setAmount(tokenBalance.toString())
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">
              {step === 'confirm' ? 'Confirm Sale' : 'Sell Coin'}
            </DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {step === 'input' ? (
          <div className="space-y-6">
            {/* Token Display */}
            <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${getTokenColor(selectedToken)} rounded-full flex items-center justify-center font-bold text-white text-xl`}
                >
                  {getTokenIcon(selectedToken)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{selectedToken?.toUpperCase()}</p>
                  <p className="text-sm text-gray-400">{getTokenName(selectedToken)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Available</p>
                  <p className="font-medium">{tokenBalance.toFixed(6)}</p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-400">Amount to Sell</label>
                <button
                  onClick={handleSetMaxAmount}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Use Max
                </button>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError(null)
                  }}
                  placeholder="0.00"
                  className="bg-[#0F172A] border-slate-700 text-white text-xl font-semibold pr-16 h-14"
                  step="any"
                  min="0"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  {selectedToken?.toUpperCase()}
                </span>
              </div>
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-gray-400">
                  ≈ ${getUsdValue().toFixed(2)} USD
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Receive Payment Via</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white h-14 px-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">
                      {paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 
                       paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-slate-700">
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Proceed Button */}
            <Button
              onClick={handleValidateAndProceed}
              disabled={isLoading || tokenBalance === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-base h-14"
            >
              {tokenBalance === 0 ? (
                'No Balance to Sell'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="space-y-6">
            <div className="bg-[#0F172A] rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Selling</span>
                <span className="font-semibold">{parseFloat(amount).toFixed(6)} {selectedToken?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Value</span>
                <span className="font-semibold text-green-400">${getUsdValue().toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-medium">
                  {paymentMethod === 'bank-transfer' ? 'Bank Transfer' : 
                   paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Network Fee</span>
                  <span className="text-sm">~$0.50</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-500 text-sm text-center">
                Tap your NFC card to confirm this transaction
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              onClick={handleConfirmSell}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-base h-14"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Confirm & Sell
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
