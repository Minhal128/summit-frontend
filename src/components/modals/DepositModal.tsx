"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Loader2, CreditCard, CheckCircle, AlertCircle, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

// Stripe publishable key (safe for client-side)
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QhxcRAtSFeuCmPAJW6zwkpg6sFPGFpU4i5W1RAijd7bUcKYoWAalsIx3xNn4WToyDxEYKmHNzSOsHb14PXH8k1U002Cj7ZQg3'

// Load Stripe outside of component to avoid recreating on each render
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (amount: number, newBalance: number) => void
}

// Card element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#60a5fa',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
}

// Inner form component that uses Stripe hooks
function DepositForm({ amount, onSuccess, onClose }: { 
  amount: number
  onSuccess?: (amount: number, newBalance: number) => void
  onClose: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)
  const [newBalance, setNewBalance] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const token = localStorage.getItem('nfc_token') || localStorage.getItem('auth_token')
      
      if (!token) {
        throw new Error('Please login first')
      }

      // Create payment intent on backend
      const intentRes = await fetch(`${API_BASE}/api/deposit/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      })

      const intentData = await intentRes.json()

      if (intentData.status !== 'success') {
        throw new Error(intentData.message || 'Failed to create payment')
      }

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        intentData.data.clientSecret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed')
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm with backend
        const confirmRes = await fetch(`${API_BASE}/api/deposit/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id })
        })

        const confirmData = await confirmRes.json()
        
        if (confirmData.status === 'success') {
          setNewBalance(confirmData.data.newBalance)
          setSucceeded(true)
          onSuccess?.(amount, confirmData.data.newBalance)
        }
      }
    } catch (err: any) {
      console.error('Deposit error:', err)
      setError(err.message || 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Deposit Successful!</h3>
        <p className="text-gray-400 mb-2">${amount.toFixed(2)} has been added to your account</p>
        <p className="text-lg text-green-400 font-semibold mb-6">
          New Balance: ${newBalance.toFixed(2)}
        </p>
        <Button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
        >
          Done
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#0F172A] rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-2">Deposit Amount</p>
        <p className="text-3xl font-bold text-white">${amount.toFixed(2)}</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-400">Card Details</label>
        <div className="bg-[#0F172A] border border-slate-700 rounded-xl p-4">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl text-base h-14"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay ${amount.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  )
}

export default function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [step, setStep] = useState<'amount' | 'payment'>('amount')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('amount')
      setAmount('')
      setError(null)
    }
  }, [isOpen])

  const handleAmountSubmit = () => {
    setError(null)
    const depositAmount = parseFloat(amount)

    if (!amount || isNaN(depositAmount)) {
      setError('Please enter a valid amount')
      return
    }

    if (depositAmount < 5) {
      setError('Minimum deposit is $5.00')
      return
    }

    if (depositAmount > 10000) {
      setError('Maximum deposit is $10,000.00')
      return
    }

    setStep('payment')
  }

  const presetAmounts = [10, 25, 50, 100, 250, 500]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            {step === 'amount' ? 'Add Funds' : 'Complete Payment'}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {step === 'amount' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Enter Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setError(null)
                  }}
                  placeholder="0.00"
                  className="bg-[#0F172A] border-slate-700 text-white text-2xl font-semibold pl-10 h-16"
                  step="0.01"
                  min="5"
                  max="10000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Quick Select</label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset.toString())
                      setError(null)
                    }}
                    className={`py-3 rounded-xl font-medium transition-colors ${
                      amount === preset.toString()
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0F172A] text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button
              onClick={handleAmountSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-base h-14"
            >
              Continue to Payment
            </Button>

            <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-sm">
              <p className="text-gray-400">With your deposited funds, you can:</p>
              <ul className="text-gray-300 space-y-1">
                <li>• Buy cryptocurrency (BTC, ETH, TRX, etc.)</li>
                <li>• Sell crypto back to USD balance</li>
                <li>• No additional fees for internal trades</li>
              </ul>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <DepositForm 
              amount={parseFloat(amount)} 
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}
