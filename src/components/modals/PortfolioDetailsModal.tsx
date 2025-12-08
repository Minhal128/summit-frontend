"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy } from "lucide-react"
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Receive {selectedToken}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
              <div className="text-black text-xs">QR Code</div>
            </div>
            <p className="text-sm text-gray-400">Network: {selectedNetwork?.name}</p>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400 break-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</span>
              <Button variant="ghost" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
