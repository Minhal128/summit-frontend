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
  ArrowLeft,
  X,
  Shield,
  Send,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  Info
} from "lucide-react"
import {
  estimateSendFee,
  createSendTransaction,
  executeSendTransaction,
  formatCryptoAmount,
  formatUsdAmount,
  type FeeEstimate
} from "@/lib/transactionApi"
import { getStoredCardId } from "@/lib/nfcApi"
import NfcTransactionAuth from "./NfcTransactionAuth"

interface SendCoinModalProps {
  isOpen: boolean
  onClose: () => void
  walletId: string
  selectedToken?: {
    symbol: string
    name: string
    balance: string
    network?: string
    usdValue?: number
  }
  onSuccess?: (transactionId: string) => void
}

type SendStep = 'input' | 'review' | 'nfc' | 'processing' | 'success' | 'error'

const NETWORKS = [
  { id: 'tron', name: 'Tron (TRC20)', prefix: 'T' },
  { id: 'ethereum', name: 'Ethereum (ERC20)', prefix: '0x' },
  { id: 'bitcoin', name: 'Bitcoin', prefix: 'bc1' },
]

export default function EnhancedSendCoinModal({
  isOpen,
  onClose,
  walletId,
  selectedToken,
  onSuccess
}: SendCoinModalProps) {
  // Form state
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [network, setNetwork] = useState(NETWORKS[0].id)
  const [memo, setMemo] = useState("")
  
  // Fee state
  const [feeEstimate, setFeeEstimate] = useState<FeeEstimate | null>(null)
  const [loadingFee, setLoadingFee] = useState(false)
  const [feeError, setFeeError] = useState<string | null>(null)
  
  // Transaction state
  const [step, setStep] = useState<SendStep>('input')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  
  const cardId = getStoredCardId()

  // Calculate fee when amount changes
  useEffect(() => {
    const fetchFee = async () => {
      if (!amount || parseFloat(amount) <= 0 || !selectedToken) {
        setFeeEstimate(null)
        return
      }

      setLoadingFee(true)
      setFeeError(null)

      try {
        const response = await estimateSendFee(
          amount,
          selectedToken.symbol,
          recipientAddress || undefined
        )
        setFeeEstimate(response)
      } catch (err: any) {
        console.error("Failed to estimate fee:", err)
        setFeeError(err.message || "Failed to estimate fee")
        setFeeEstimate(null)
      } finally {
        setLoadingFee(false)
      }
    }

    const debounce = setTimeout(fetchFee, 500)
    return () => clearTimeout(debounce)
  }, [amount, selectedToken?.symbol, recipientAddress])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('input')
      setAmount("")
      setRecipientAddress("")
      setMemo("")
      setFeeEstimate(null)
      setTransactionId(null)
      setActionId(null)
      setError(null)
      setTxHash(null)
    }
  }, [isOpen])

  // Validate address format
  const isValidAddress = (address: string): boolean => {
    if (!address) return false
    // Basic validation - real implementation would check blockchain-specific formats
    return address.length >= 26 && address.length <= 62
  }

  // Check if can proceed
  const canProceed = 
    amount && 
    parseFloat(amount) > 0 && 
    recipientAddress && 
    isValidAddress(recipientAddress) &&
    feeEstimate &&
    !feeError

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setRecipientAddress(text.trim())
    } catch (err) {
      console.error("Failed to paste:", err)
    }
  }

  // Handle max button
  const handleMax = () => {
    if (selectedToken?.balance) {
      setAmount(selectedToken.balance)
    }
  }

  // Create send transaction
  const handleCreateTransaction = async () => {
    if (!selectedToken) return
    setError(null)

    try {
      const response = await createSendTransaction({
        toAddress: recipientAddress,
        amount,
        currency: selectedToken.symbol,
        walletId,
        memo: memo || undefined
      })

      setTransactionId(response.transaction.id)
      setActionId(response.transaction.actionId || null)

      if (response.transaction.nfcRequired) {
        setStep('nfc')
      } else {
        // Direct execution if NFC not required
        await handleExecuteTransaction(response.transaction.id, '')
      }
    } catch (err: any) {
      console.error("Failed to create transaction:", err)
      setError(err.message || "Failed to create transaction")
      setStep('error')
    }
  }

  // Execute transaction after NFC authorization
  const handleExecuteTransaction = async (txId: string, nfcAuthId: string) => {
    setStep('processing')
    setError(null)

    try {
      const response = await executeSendTransaction({
        transactionId: txId,
        nfcAuthId
      })

      setTxHash(response.transaction.txHash || null)
      setStep('success')

      if (onSuccess && response.transaction.id) {
        onSuccess(response.transaction.id)
      }
    } catch (err: any) {
      console.error("Transaction execution failed:", err)
      setError(err.message || "Transaction execution failed")
      setStep('error')
    }
  }

  // NFC authorization complete handler
  const handleNfcAuthComplete = async (authResult: { authorizationId: string; success: boolean }) => {
    if (!authResult.success || !transactionId) {
      setError("NFC authorization failed")
      setStep('error')
      return
    }

    await handleExecuteTransaction(transactionId, authResult.authorizationId)
  }

  // Render input step
  const renderInputStep = () => (
    <div className="space-y-5">
      {/* Amount */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Amount</label>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                {selectedToken?.symbol?.charAt(0) || '?'}
              </div>
              <span className="text-white font-medium">{selectedToken?.symbol || 'Token'}</span>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent border-0 text-white text-2xl text-right focus:ring-0 p-0 w-full max-w-[200px]"
            />
          </div>
          {selectedToken?.balance && (
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">
                Balance: {formatCryptoAmount(selectedToken.balance)} {selectedToken.symbol}
              </span>
              <button
                onClick={handleMax}
                className="text-blue-400 hover:text-blue-300"
              >
                MAX
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recipient Address */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Recipient Address</label>
        <div className="relative">
          <Input
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white pr-20"
            placeholder="Enter wallet address"
          />
          <Button
            size="sm"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-600 hover:bg-slate-500 text-xs px-3 py-1 h-7"
          >
            <Copy className="w-3 h-3 mr-1" />
            Paste
          </Button>
        </div>
        {recipientAddress && !isValidAddress(recipientAddress) && (
          <p className="text-red-400 text-xs mt-1">Please enter a valid wallet address</p>
        )}
      </div>

      {/* Network */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Network</label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 text-white p-3 rounded-lg"
        >
          {NETWORKS.map((net) => (
            <option key={net.id} value={net.id}>
              {net.name}
            </option>
          ))}
        </select>
      </div>

      {/* Memo (Optional) */}
      <div>
        <label className="text-gray-400 text-sm block mb-2">Memo (Optional)</label>
        <Input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="bg-slate-800 border-slate-600 text-white"
          placeholder="Add a note"
        />
      </div>

      {/* Fee Estimate */}
      {loadingFee && (
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Calculating fees...
        </div>
      )}

      {feeEstimate && !loadingFee && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Platform Fee ({feeEstimate.fees.feePercentage}%)</span>
            <span className="text-white">{formatCryptoAmount(feeEstimate.fees.platformFee)} {selectedToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Network Fee</span>
            <span className="text-white">{formatCryptoAmount(feeEstimate.fees.networkFee)} {selectedToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400 pt-2 border-t border-slate-700">
            <span>Total Fee</span>
            <span className="text-white font-semibold">{formatCryptoAmount(feeEstimate.fees.totalFee)} {selectedToken?.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Recipient Receives</span>
            <span className="text-green-400 font-semibold">{formatCryptoAmount(feeEstimate.breakdown.recipientReceives)} {selectedToken?.symbol}</span>
          </div>
        </div>
      )}

      {feeError && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {feeError}
        </div>
      )}

      {/* NFC Required Notice */}
      {cardId && (
        <div className="bg-blue-900/20 text-blue-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <Shield className="w-4 h-4" />
          NFC card authorization required to send
        </div>
      )}

      {/* Send Button */}
      <Button
        onClick={() => setStep('review')}
        disabled={!canProceed}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl"
      >
        <Send className="w-5 h-5 mr-2" />
        Review Transaction
      </Button>
    </div>
  )

  // Render review step
  const renderReviewStep = () => (
    <div className="space-y-5">
      {/* Transaction Summary */}
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
          {selectedToken?.symbol?.charAt(0) || '?'}
        </div>
        <p className="text-3xl font-bold text-white mb-1">{formatCryptoAmount(amount)}</p>
        <p className="text-gray-400">{selectedToken?.symbol}</p>
      </div>

      {/* Details */}
      <div className="bg-slate-800 rounded-xl p-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">To</span>
          <span className="text-white font-mono text-xs">
            {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-8)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Network</span>
          <span className="text-white">{NETWORKS.find(n => n.id === network)?.name}</span>
        </div>
        {memo && (
          <div className="flex justify-between">
            <span className="text-gray-400">Memo</span>
            <span className="text-white">{memo}</span>
          </div>
        )}
        {feeEstimate && (
          <>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-gray-400">Platform Fee</span>
              <span className="text-white">{formatCryptoAmount(feeEstimate.fees.platformFee)} {selectedToken?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Fee</span>
              <span className="text-white">{formatCryptoAmount(feeEstimate.fees.networkFee)} {selectedToken?.symbol}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-white font-semibold">{formatCryptoAmount(feeEstimate.breakdown.totalDeducted)} {selectedToken?.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient Receives</span>
              <span className="text-green-400 font-semibold">{formatCryptoAmount(feeEstimate.breakdown.recipientReceives)} {selectedToken?.symbol}</span>
            </div>
          </>
        )}
      </div>

      {/* Warning */}
      <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-lg text-sm flex items-center gap-2">
        <Info className="w-4 h-4" />
        Please verify the recipient address. Transactions cannot be reversed.
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('input')}
          className="flex-1 border-slate-600 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleCreateTransaction}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Shield className="w-4 h-4 mr-2" />
          Confirm & Authorize
        </Button>
      </div>
    </div>
  )

  // Render NFC step
  const renderNfcStep = () => (
    <div className="py-4">
      <NfcTransactionAuth
        transactionType="send"
        amount={amount}
        currency={selectedToken?.symbol || 'Token'}
        recipientAddress={recipientAddress}
        onAuthorizationComplete={handleNfcAuthComplete}
        onCancel={() => setStep('input')}
      />
    </div>
  )

  // Render processing step
  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Processing Transaction</h3>
      <p className="text-gray-400">
        Sending {formatCryptoAmount(amount)} {selectedToken?.symbol}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Please wait while we process your transaction...
      </p>
    </div>
  )

  // Render success step
  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Transaction Sent!</h3>
      <p className="text-gray-400 mb-4">
        Successfully sent {formatCryptoAmount(amount)} {selectedToken?.symbol}
      </p>
      {txHash && (
        <div className="bg-slate-800 rounded-lg p-3 mb-4">
          <p className="text-gray-400 text-xs mb-1">Transaction Hash</p>
          <p className="text-white text-sm font-mono break-all">
            {txHash}
          </p>
        </div>
      )}
      <Button
        onClick={onClose}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Done
      </Button>
    </div>
  )

  // Render error step
  const renderErrorStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Transaction Failed</h3>
      <p className="text-red-400 mb-4">{error || "An unknown error occurred"}</p>
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-slate-600 text-gray-400 hover:text-white"
        >
          Close
        </Button>
        <Button
          onClick={() => setStep('input')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Try Again
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Send className="w-5 h-5 text-blue-400" />
              {step === 'input' && "Send Crypto"}
              {step === 'review' && "Review Transaction"}
              {step === 'nfc' && "NFC Authorization"}
              {step === 'processing' && "Processing"}
              {step === 'success' && "Success"}
              {step === 'error' && "Error"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400 mt-1">
            {step === 'input' && "Send cryptocurrency to another wallet"}
            {step === 'review' && "Confirm your transaction details"}
            {step === 'nfc' && "Tap your NFC card to authorize"}
            {step === 'processing' && "Please wait..."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4">
          {step === 'input' && renderInputStep()}
          {step === 'review' && renderReviewStep()}
          {step === 'nfc' && renderNfcStep()}
          {step === 'processing' && renderProcessingStep()}
          {step === 'success' && renderSuccessStep()}
          {step === 'error' && renderErrorStep()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
