"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X, Copy } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface ReceiveModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
}

export default function ReceiveModal({ isOpen, onClose, onBack, selectedToken }: ReceiveModalProps) {
  const depositAddress = "4663OFFJPIRHJFFNBJHUIB"
  const network = "Tron (TRC20)"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-bold">Portfolio details</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 text-center">
          <div className="bg-white p-6 rounded-2xl mb-6 inline-block">
            <QRCodeSVG value={depositAddress} size={200} bgColor="#ffffff" fgColor="#000000" level="M" />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{depositAddress}</span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-400 text-sm">Deposit Address</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{network}</p>
              <p className="text-gray-400 text-sm">Network</p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
