"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useWallet } from "@/contexts/WalletContext"

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
  const { walletAddresses } = useWallet()
  const [copied, setCopied] = useState(false)

  // Get wallet address based on selected token
  const getWalletAddress = () => {
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
                ⚠️ Only send {selectedToken?.toUpperCase() || "tokens"} on the {network.name} network to this address
              </p>
            </>
          ) : (
            <div className="py-8">
              <p className="text-gray-400">No wallet address available</p>
              <p className="text-sm text-gray-500 mt-2">Please connect your wallet first</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
