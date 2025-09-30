"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import type { Network } from "@/types"

interface ChooseNetworkModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: (network: Network) => void
}

const networks: Network[] = [
  { name: "Ethereum", symbol: "ETH", icon: "E" },
  { name: "Bitcoin", symbol: "BTC", icon: "B" },
]

export default function ChooseNetworkModal({
  isOpen,
  onClose,
  onBack,
  selectedToken,
  onProceed,
}: ChooseNetworkModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Choose Network</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-2">
          {networks.map((network) => (
            <div
              key={network.symbol}
              className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-xl transition-colors cursor-pointer"
              onClick={() => onProceed(network)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                  {network.icon}
                </div>
                <p className="font-semibold text-white">{network.name}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
