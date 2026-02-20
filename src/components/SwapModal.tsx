"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ArrowLeftRight,
  RefreshCw,
  Settings,
  ArrowDown,
  Zap,
  Info,
  Check,
  X,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getSwapQuote,
  createSwapTransaction,
  executeSwapTransaction,
  formatCryptoAmount,
  formatUsdAmount,
  type SwapQuote
} from "@/lib/transactionApi"
import { createActionNonce, authorizeAction, getStoredCardId } from "@/lib/nfcApi"
import { NfcTransactionAuth } from "./NfcTransactionAuth"

interface Token {
  symbol: string
  name: string
  balance?: string
  usdValue?: number
}

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
  walletId: string
  availableTokens?: Token[]
  onSuccess?: (transactionId: string) => void
}

const DEFAULT_TOKENS: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: "0", usdValue: 0 },
  { symbol: "BTC", name: "Bitcoin", balance: "0", usdValue: 0 },
  { symbol: "USDC", name: "USD Coin", balance: "0", usdValue: 0 },
  { symbol: "USDT", name: "Tether", balance: "0", usdValue: 0 },
  { symbol: "TRX", name: "Tron", balance: "0", usdValue: 0 },
]

const TOKEN_COLORS: Record<string, string> = {
  ETH: "bg-purple-500",
  BTC: "bg-orange-500",
  USDC: "bg-blue-500",
  USDT: "bg-green-500",
  TRX: "bg-red-500",
  DAI: "bg-yellow-500",
}

type SwapStep = 'input' | 'review' | 'nfc' | 'processing' | 'success' | 'error'

export default function SwapModal({
  isOpen,
  onClose,
  walletId,
  availableTokens = DEFAULT_TOKENS,
  onSuccess
}: SwapModalProps) {
  // Form state
  const [fromToken, setFromToken] = useState<Token>(availableTokens[0])
  const [toToken, setToToken] = useState<Token>(availableTokens[2])
  const [fromAmount, setFromAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [showFromTokens, setShowFromTokens] = useState(false)
  const [showToTokens, setShowToTokens] = useState(false)

  // Quote state
  const [quote, setQuote] = useState<SwapQuote | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [quoteError, setQuoteError] = useState<string | null>(null)

  // Transaction state
  const [step, setStep] = useState<SwapStep>('input')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Fetch quote when inputs change
  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setQuote(null)
        return
      }

      setLoadingQuote(true)
      setQuoteError(null)

      try {
        const response = await getSwapQuote(
          fromToken.symbol,
          toToken.symbol,
          fromAmount
        )
        setQuote(response)
      } catch (err: any) {
        console.error("Failed to get quote:", err)
        setQuoteError(err.message || "Failed to get quote")
        setQuote(null)
      } finally {
        setLoadingQuote(false)
      }
    }

    const debounce = setTimeout(fetchQuote, 500)
    return () => clearTimeout(debounce)
  }, [fromAmount, fromToken.symbol, toToken.symbol])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('input')
      setFromAmount("")
      setQuote(null)
      setTransactionId(null)
      setActionId(null)
      setError(null)
      setTxHash(null)
    }
  }, [isOpen])

  // Switch tokens
  const handleSwitchTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount("")
    setQuote(null)
  }

  // Create swap transaction
  const handleReviewSwap = async () => {
    if (!quote) return

    setError(null)

    try {
      const response = await createSwapTransaction({
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount,
        walletId,
        slippageTolerance: slippage
      })

      setTransactionId(response.transaction.id)
      setActionId(response.transaction.actionId || null)

      if (response.transaction.nfcRequired) {
        setStep('nfc')
      } else {
        // Direct execution if NFC not required
        await handleExecuteSwap(response.transaction.id, '')
      }
    } catch (err: any) {
      console.error("Failed to create swap:", err)
      setError(err.message || "Failed to create swap transaction")
      setStep('error')
    }
  }

  // Execute swap after NFC authorization
  const handleExecuteSwap = async (txId: string, nfcAuthId: string) => {
    setStep('processing')
    setError(null)

    try {
      const response = await executeSwapTransaction({
        transactionId: txId,
        nfcAuthId
      })

      setTxHash(response.transaction.txHash || null)
      setStep('success')

      if (onSuccess && response.transaction.id) {
        onSuccess(response.transaction.id)
      }
    } catch (err: any) {
      console.error("Swap execution failed:", err)
      setError(err.message || "Swap execution failed")
      setStep('error')
    }
  }

  // NFC authorization complete handler
  const handleNfcAuthComplete = async (actionPayload: any) => {
    if (!transactionId) {
      setError("NFC authorization failed")
      setStep('error')
      return
    }

    await handleExecuteSwap(transactionId, actionPayload?.actionId || '')
  }

  // Render token selector dropdown
  const TokenSelector = ({
    selected,
    onSelect,
    show,
    onClose: closeSelector,
    exclude
  }: {
    selected: Token
    onSelect: (token: Token) => void
    show: boolean
    onClose: () => void
    exclude: string
  }) => {
    if (!show) return null

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 max-h-64 overflow-y-auto">
        {availableTokens
          .filter(t => t.symbol !== exclude)
          .map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onSelect(token)
                closeSelector()
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-700 transition-colors"
            >
              <div className={`w-8 h-8 ${TOKEN_COLORS[token.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                {token.symbol.charAt(0)}
              </div>
              <div className="text-left flex-1">
                <p className="text-white font-medium">{token.symbol}</p>
                <p className="text-gray-400 text-xs">{token.name}</p>
              </div>
              {token.balance && (
                <div className="text-right">
                  <p className="text-white text-sm">{formatCryptoAmount(token.balance)}</p>
                </div>
              )}
            </button>
          ))}
      </div>
    )
  }

  // Render input step
  const renderInputStep = () => (
    <div className="space-y-4">
      {/* Settings Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Zap className="w-4 h-4 text-yellow-400" />
          Powered by Uniswap V3
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 bg-slate-800 rounded-xl">
          <p className="text-gray-400 text-sm mb-3">Slippage Tolerance</p>
          <div className="flex gap-2">
            {[0.1, 0.5, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSlippage(s)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  slippage === s
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-gray-400 hover:text-white"
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* From Token */}
      <div className="relative">
        <label className="block text-gray-400 text-sm mb-2">You pay</label>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFromTokens(!showFromTokens)}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <div className={`w-6 h-6 ${TOKEN_COLORS[fromToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                {fromToken.symbol.charAt(0)}
              </div>
              <span className="text-white font-medium">{fromToken.symbol}</span>
            </button>
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="bg-transparent border-0 text-white text-2xl text-right focus:ring-0 p-0"
            />
          </div>
          {fromToken.balance && (
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-400">Balance: {formatCryptoAmount(fromToken.balance)} {fromToken.symbol}</span>
              <button
                onClick={() => setFromAmount(fromToken.balance || "0")}
                className="text-blue-400 hover:text-blue-300"
              >
                MAX
              </button>
            </div>
          )}
        </div>
        <TokenSelector
          selected={fromToken}
          onSelect={setFromToken}
          show={showFromTokens}
          onClose={() => setShowFromTokens(false)}
          exclude={toToken.symbol}
        />
      </div>

      {/* Switch Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwitchTokens}
          className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl border-4 border-slate-900 transition-colors"
        >
          <ArrowDown className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* To Token */}
      <div className="relative">
        <label className="block text-gray-400 text-sm mb-2">You receive</label>
        <div className="bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowToTokens(!showToTokens)}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <div className={`w-6 h-6 ${TOKEN_COLORS[toToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                {toToken.symbol.charAt(0)}
              </div>
              <span className="text-white font-medium">{toToken.symbol}</span>
            </button>
            <div className="text-2xl text-white text-right">
              {loadingQuote ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : quote ? (
                formatCryptoAmount(quote.quote.toAmount)
              ) : (
                <span className="text-gray-500">0.0</span>
              )}
            </div>
          </div>
        </div>
        <TokenSelector
          selected={toToken}
          onSelect={setToToken}
          show={showToTokens}
          onClose={() => setShowToTokens(false)}
          exclude={fromToken.symbol}
        />
      </div>

      {/* Quote Details */}
      {quote && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Rate</span>
            <span className="text-white">
              1 {fromToken.symbol} = {formatCryptoAmount(quote.quote.rate)} {toToken.symbol}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Platform Fee ({quote.quote.fees.feePercentage}%)</span>
            <span className="text-white">{formatCryptoAmount(quote.quote.fees.platformFee)} {fromToken.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Network Fee</span>
            <span className="text-white">{formatCryptoAmount(quote.quote.fees.networkFee)} {fromToken.symbol}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Price Impact</span>
            <span className={`${parseFloat(quote.quote.priceImpact) > 1 ? 'text-red-400' : 'text-green-400'}`}>
              {quote.quote.priceImpact}%
            </span>
          </div>
          <div className="flex justify-between text-gray-400 pt-2 border-t border-slate-700">
            <span>Minimum Received</span>
            <span className="text-white">{formatCryptoAmount(quote.quote.minimumReceived)} {toToken.symbol}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {quoteError && (
        <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {quoteError}
        </div>
      )}

      {/* Swap Button */}
      <Button
        onClick={() => setStep('review')}
        disabled={!quote || loadingQuote || !!quoteError}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl"
      >
        {loadingQuote ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Getting Quote...
          </>
        ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
          "Enter Amount"
        ) : quote ? (
          "Review Swap"
        ) : (
          "Enter Amount"
        )}
      </Button>
    </div>
  )

  // Render review step
  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className={`w-12 h-12 ${TOKEN_COLORS[fromToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
              {fromToken.symbol.charAt(0)}
            </div>
            <p className="text-2xl font-bold text-white">{formatCryptoAmount(fromAmount)}</p>
            <p className="text-gray-400">{fromToken.symbol}</p>
          </div>
          <ArrowLeftRight className="w-8 h-8 text-gray-400" />
          <div className="text-center">
            <div className={`w-12 h-12 ${TOKEN_COLORS[toToken.symbol] || "bg-gray-500"} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}>
              {toToken.symbol.charAt(0)}
            </div>
            <p className="text-2xl font-bold text-white">{formatCryptoAmount(quote?.quote.toAmount || "0")}</p>
            <p className="text-gray-400">{toToken.symbol}</p>
          </div>
        </div>
      </div>

      {quote && (
        <div className="bg-slate-800 rounded-xl p-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Exchange Rate</span>
            <span className="text-white">1 {fromToken.symbol} = {formatCryptoAmount(quote.quote.rate)} {toToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Platform Fee</span>
            <span className="text-white">{formatCryptoAmount(quote.quote.fees.platformFee)} {fromToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Network Fee</span>
            <span className="text-white">{formatCryptoAmount(quote.quote.fees.networkFee)} {fromToken.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Slippage Tolerance</span>
            <span className="text-white">{slippage}%</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-700">
            <span className="text-gray-400">Minimum Received</span>
            <span className="text-white font-semibold">{formatCryptoAmount(quote.quote.minimumReceived)} {toToken.symbol}</span>
          </div>
        </div>
      )}

      <div className="bg-yellow-900/20 text-yellow-400 p-3 rounded-lg text-sm flex items-center gap-2">
        <Info className="w-4 h-4" />
        You will need to authorize this swap with your NFC card
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('input')}
          className="flex-1 border-slate-600 text-gray-400 hover:text-white"
        >
          Back
        </Button>
        <Button
          onClick={handleReviewSwap}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          Confirm & Authorize
        </Button>
      </div>
    </div>
  )

  // Render NFC authorization step
  const renderNfcStep = () => (
    <div className="py-4">
      <NfcTransactionAuth
        isOpen={step === 'nfc'}
        onClose={() => setStep('input')}
        cardId={getStoredCardId() || ''}
        actionType="swap"
        actionData={{
          amount: fromAmount,
          fromToken: fromToken.symbol,
          toToken: toToken.symbol,
        }}
        onAuthorized={handleNfcAuthComplete}
        onError={(error) => {
          setError(error)
          setStep('error')
        }}
      />
    </div>
  )

  // Render processing step
  const renderProcessingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Processing Swap</h3>
      <p className="text-gray-400">
        Executing swap on the blockchain...
      </p>
      <p className="text-gray-500 text-sm mt-2">
        This may take a few moments
      </p>
    </div>
  )

  // Render success step
  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Swap Successful!</h3>
      <p className="text-gray-400 mb-4">
        Successfully swapped {formatCryptoAmount(fromAmount)} {fromToken.symbol} for {toToken.symbol}
      </p>
      {txHash && (
        <p className="text-gray-500 text-sm mb-4 break-all">
          Transaction: {txHash.slice(0, 10)}...{txHash.slice(-10)}
        </p>
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
      <h3 className="text-xl font-semibold text-white mb-2">Swap Failed</h3>
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
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ArrowLeftRight className="w-6 h-6 text-blue-400" />
            {step === 'input' && "Swap Tokens"}
            {step === 'review' && "Review Swap"}
            {step === 'nfc' && "NFC Authorization"}
            {step === 'processing' && "Processing"}
            {step === 'success' && "Success"}
            {step === 'error' && "Error"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'input' && "Exchange one cryptocurrency for another"}
            {step === 'review' && "Confirm your swap details"}
            {step === 'nfc' && "Tap your NFC card to authorize"}
            {step === 'processing' && "Please wait..."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
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
