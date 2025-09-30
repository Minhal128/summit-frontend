"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface HardwareWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
}

export default function HardwareWalletModal({ isOpen, onClose, onCancel }: HardwareWalletModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
        // Trigger success modal
        const event = new CustomEvent("hardwareWalletConfirmed")
        window.dispatchEvent(event)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-blue-500"></div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Confirm on Your Hardware Wallet</h2>
          <p className="text-gray-400 mb-8">
            Please review and approve this transaction
            <br />
            directly on your connected hardware device.
          </p>

          <Button onClick={onCancel} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
