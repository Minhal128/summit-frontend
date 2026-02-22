"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { useWallet } from "@/contexts/WalletContext"
import type { Network } from "@/types"

interface PortfolioDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  selectedNetwork?: Network | null
}

export default function PortfolioDetailsModal({
  isOpen,
  onClose,
  onBack,
  selectedToken,
  selectedNetwork,
}: PortfolioDetailsModalProps) {
  const { balances, refreshBalances } = useWallet()
  const [copied, setCopied] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && selectedToken) {
      // Find the wallet address for the selected token
      const wallet = balances.find(
        b => b.symbol.toUpperCase() === selectedToken?.toUpperCase()
      )
      if (wallet && wallet.addresses.length > 0) {
        setWalletAddress(wallet.addresses[0])
      } else {
        setWalletAddress(null)
      }
    }
  }, [isOpen, selectedToken, balances])

  const handleCopy = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getNetworkName = () => {
    if (selectedNetwork?.name) return selectedNetwork.name
    // Map token to network
    const networkMap: Record<string, string> = {
      'ETH': 'Ethereum (Sepolia Testnet)',
      'BTC': 'Bitcoin (Testnet)',
      'TRX': 'Tron (Nile Testnet)',
      'SOL': 'Solana (Devnet)',
      'USDT': 'Ethereum (ERC-20)',
    }
    return networkMap[selectedToken?.toUpperCase() || ''] || 'Unknown Network'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-bold">Portfolio details</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400">
              ×
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            {walletAddress ? (
              <div className="bg-white p-4 mx-auto mb-4 rounded-lg inline-block">
                <QRCodeSVG 
                  value={walletAddress} 
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slate-700 mx-auto mb-4 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-400 text-sm mb-2">No wallet found</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={refreshBalances}
                  className="text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-[#0F172A] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-white font-mono text-sm break-all">
                  {walletAddress || 'No address available'}
                </p>
                <p className="text-gray-400 text-xs mt-1">Deposit Address</p>
              </div>
              {walletAddress && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                  className="ml-2 flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-[#0F172A] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">{selectedToken}</p>
                <p className="text-gray-400 text-xs">Network</p>
              </div>
              <span className="text-gray-400">⇄</span>
            </div>
          </div>

          <p className="text-gray-500 text-xs text-center">
            {getNetworkName()}
          </p>

          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
