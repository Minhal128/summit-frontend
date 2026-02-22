"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X, Copy, Check, Loader2, CreditCard } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useWallet } from "@/contexts/WalletContext"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://king-prawn-app-nv72k.ondigitalocean.app'

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
}

const networkInfo: Record<string, { name: string; testnet: string }> = {
  ETH: { name: "Ethereum", testnet: "Sepolia Testnet" },
  BTC: { name: "Bitcoin", testnet: "Testnet" },
  TRX: { name: "Tron", testnet: "Nile Testnet" },
  SOL: { name: "Solana", testnet: "Devnet" },
  USDT: { name: "Tron (TRC20)", testnet: "Nile Testnet" },
}

export default function ReceiveModal({ isOpen, onClose, onBack, selectedToken }: ReceiveModalProps) {
  const { walletAddresses, refreshBalances } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAddress, setFetchedAddress] = useState<string | null>(null)

  // Reset state when modal opens/closes or token changes
  useEffect(() => {
    if (isOpen) {
      setFetchedAddress(null)
      setError(null)
      setIsLoading(false)
    }
  }, [isOpen, selectedToken])

  // Get wallet address based on selected token
  const getWalletAddress = () => {
    if (fetchedAddress) return fetchedAddress
    if (!selectedToken) return walletAddresses.ETH || ""
    
    const token = selectedToken.toUpperCase()
    if (token === "BTC") return walletAddresses.BTC || ""
    if (token === "TRX" || token === "USDT") return walletAddresses.TRX || ""
    if (token === "SOL") return walletAddresses.SOL || ""
    return walletAddresses.ETH || ""
  }

  const getNetwork = () => {
    if (!selectedToken) return networkInfo.ETH
    const token = selectedToken.toUpperCase()
    return networkInfo[token] || networkInfo.ETH
  }

  const depositAddress = getWalletAddress()
  const network = getNetwork()

  // Fetch wallet address via NFC tap
  const handleTapCard = async () => {
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

      // Fetch wallet addresses from NFC endpoint
      const response = await fetch(`${API_BASE}/api/nfc/transactions/receive/all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cardUid: cardId })
      })

      const result = await response.json()

      if ((result.success || result.status === 'success') && result.wallets) {
        // Find the wallet for the selected token
        const tokenLower = (selectedToken || 'eth').toLowerCase()
        const wallet = result.wallets.find((w: any) => 
          w.cryptocurrency?.toLowerCase() === tokenLower
        )

        if (wallet?.address) {
          setFetchedAddress(wallet.address)
          // Also refresh the wallet context
          refreshBalances()
        } else {
          setError(`No ${selectedToken?.toUpperCase() || 'ETH'} wallet found for this card`)
        }
      } else {
        setError(result.message || 'Failed to fetch wallet address')
      }
    } catch (err: any) {
      console.error('Tap card error:', err)
      setError(err.message || 'Failed to connect. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = async () => {
    if (depositAddress) {
      await navigator.clipboard.writeText(depositAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 20) return address
    return `${address.slice(0, 12)}...${address.slice(-8)}`
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
              <DialogTitle className="text-xl font-bold">
                Receive {selectedToken?.toUpperCase() || "Crypto"}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 text-center">
          {depositAddress ? (
            <>
              <div className="bg-white p-6 rounded-2xl mb-6 inline-block">
                <QRCodeSVG value={depositAddress} size={200} bgColor="#ffffff" fgColor="#000000" level="M" />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-white font-medium text-sm break-all">{truncateAddress(depositAddress)}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white"
                    onClick={copyAddress}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Deposit Address</p>
                <p className="text-xs text-gray-500 mt-1 break-all">{depositAddress}</p>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <p className="text-white font-medium">{network.name}</p>
                <p className="text-yellow-500 text-sm">{network.testnet}</p>
              </div>

              <p className="text-yellow-500 text-xs mt-4">
                Only send {selectedToken?.toUpperCase() || "tokens"} on the {network.name} network to this address
              </p>
            </>
          ) : (
            <div className="py-8">
              <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-blue-400" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Tap Your NFC Card</h3>
              <p className="text-gray-400 text-sm mb-6">
                Tap your card to retrieve your {selectedToken?.toUpperCase() || "crypto"} wallet address
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={handleTapCard}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Fetching Address...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Tap Card to Get Address
                  </>
                )}
              </Button>

              <p className="text-gray-500 text-xs mt-4">
                Your wallet address will be displayed after tapping your NFC card
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
