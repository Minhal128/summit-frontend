"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, X, Shield, AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import NfcTransactionAuth from "./NfcTransactionAuth"
import { getStoredCardId } from "@/lib/nfcApi"
import { useWallet } from "@/contexts/WalletContext"
import { getTransactionHistory, formatTransactionDate, Transaction } from "@/lib/transactionHistory"

interface SendCoinModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: () => void
}

export default function SendCoinModal({ isOpen, onClose, onBack, selectedToken, onProceed }: SendCoinModalProps) {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [description, setDescription] = useState("")
  const [network, setNetwork] = useState("ETH")
  const [showNfcAuth, setShowNfcAuth] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recentTx, setRecentTx] = useState<Transaction[]>([])
  const [loadingTx, setLoadingTx] = useState(false)
  const cardId = getStoredCardId()
  const { balances } = useWallet()

  // Get balance for selected token
  const selectedBalance = balances.find(b => b.symbol.toUpperCase() === (selectedToken || network).toUpperCase())

  // Load recent transactions
  useEffect(() => {
    if (isOpen) {
      loadRecentTransactions()
      // Reset fields
      setAmount("")
      setRecipientAddress("")
      setDescription("")
      setError(null)
    }
  }, [isOpen])

  const loadRecentTransactions = async () => {
    setLoadingTx(true)
    const result = await getTransactionHistory({ limit: 3, type: 'send' })
    if (result.success) {
      setRecentTx(result.transactions)
    }
    setLoadingTx(false)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setRecipientAddress(text)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  const handleProceed = () => {
    setError(null)

    // Validate amount
    const amountNum = parseFloat(amount)
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Check balance
    if (selectedBalance && amountNum > selectedBalance.amount) {
      setError(`Insufficient balance. You have ${selectedBalance.amountFormatted}`)
      return
    }

    // Validate address
    if (!recipientAddress || recipientAddress.length < 20) {
      setError("Please enter a valid recipient address")
      return
    }

    // Check if NFC card is linked
    if (!cardId) {
      setError("No NFC card linked. Please link your card in settings.")
      return
    }

    setShowNfcAuth(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-bold">Send coin</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="text-right">
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-400 text-sm">Amount</p>
              {selectedBalance && (
                <p className="text-gray-400 text-xs">
                  Balance: {selectedBalance.amountFormatted}
                </p>
              )}
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setError(null)
              }}
              className="bg-transparent border-none text-right text-2xl font-bold text-white p-0 h-auto focus-visible:ring-0"
              placeholder="0.00"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm block mb-2">Recipient Address</label>
            <div className="relative">
              <Input
                value={recipientAddress}
                onChange={(e) => {
                  setRecipientAddress(e.target.value)
                  setError(null)
                }}
                placeholder="Enter wallet address"
                className="bg-[#0F172A] border-slate-600 text-white pr-16"
              />
              <Button
                size="sm"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-xs px-3 py-1 h-6"
              >
                Paste
              </Button>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Network</label>
            <div className="relative">
              <select 
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-600 text-white p-3 rounded-lg appearance-none"
              >
                <option value="ETH">Ethereum (Sepolia)</option>
                <option value="TRX">Tron (TRC20)</option>
                <option value="BTC">Bitcoin</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Description (optional)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this for?"
              className="bg-[#0F172A] border-slate-600 text-white"
            />
          </div>

          <Button 
            onClick={handleProceed} 
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
          >
            <Shield className="mr-2 h-4 w-4" />
            Proceed (NFC Required)
          </Button>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Recent Transactions</h3>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto text-sm">
                See More
              </Button>
            </div>
            <div className="space-y-2">
              {loadingTx ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              ) : recentTx.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent transactions</p>
              ) : (
                recentTx.map((tx) => (
                  <div key={tx.id} className="text-sm">
                    <p className="text-white font-mono text-xs truncate">{tx.toAddress}</p>
                    <p className="text-gray-400 text-xs">{tx.fromCurrency} • {formatTransactionDate(tx.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* NFC Authorization Modal */}
      {cardId && (
        <NfcTransactionAuth
          isOpen={showNfcAuth}
          onClose={() => setShowNfcAuth(false)}
          cardId={cardId}
          actionType="send"
          actionData={{
            amount: parseFloat(amount) || 0,
            toAddress: recipientAddress,
            fromToken: selectedToken || network,
            description
          }}
          onAuthorized={(actionPayload) => {
            console.log('Transaction authorized:', actionPayload)
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
}
