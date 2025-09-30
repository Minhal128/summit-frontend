"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TransactionAuthorizedModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TransactionAuthorizedModal({ isOpen, onClose }: TransactionAuthorizedModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Transaction Authorized</h2>
          <p className="text-gray-400 mb-8">
            Your transaction has been successfully confirmed
            <br />
            and is now being processed
          </p>

          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
            Okay, I Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
