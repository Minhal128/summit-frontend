"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, X, Shield } from "lucide-react"
import { useState } from "react"
import NfcTransactionAuth from "./NfcTransactionAuth"
import { getStoredCardId } from "@/lib/nfcApi"

interface SendCoinModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: () => void
}

export default function SendCoinModal({ isOpen, onClose, onBack, selectedToken, onProceed }: SendCoinModalProps) {
  const [amount, setAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("XXXXXXXXXXXXXXXXXXXX")
  const [description, setDescription] = useState("Thank You")
  const [showNfcAuth, setShowNfcAuth] = useState(false)
  const [requireNfcAuth, setRequireNfcAuth] = useState(true)
  const cardId = getStoredCardId()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <DialogTitle className="text-xl font-bold">Send coin</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-2">Amount</p>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-right text-2xl font-bold text-white p-0 h-auto focus-visible:ring-0"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Recipient Address</label>
            <div className="relative">
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="bg-[#0F172A] border-slate-600 text-white pr-16"
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-xs px-3 py-1 h-6"
              >
                Paste
              </Button>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Network</label>
            <div className="relative">
              <select className="w-full bg-[#0F172A] border border-slate-600 text-white p-3 rounded-lg appearance-none">
                <option>Tron (TRC20)</option>
                <option>Ethereum (ERC20)</option>
                <option>Bitcoin</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0F172A] border-slate-600 text-white"
            />
          </div>

          <Button 
            onClick={() => {
              if (requireNfcAuth && cardId) {
                setShowNfcAuth(true)
              } else {
                onProceed()
              }
            }} 
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-semibold"
          >
            {requireNfcAuth && cardId && <Shield className="mr-2 h-4 w-4" />}
            Proceed {requireNfcAuth && cardId && "(NFC Required)"}
          </Button>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Recent Transactions</h3>
              <Button variant="ghost" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                See More
              </Button>
            </div>
            <div className="space-y-2">
              <div className="text-white text-sm">TDGD735DDHDJDDGDHD</div>
              <div className="text-gray-400 text-xs">Tron (TRC20)</div>
              <div className="text-white text-sm mt-2">TDGD735DDHDJDDGDHD</div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* NFC Authorization Modal */}
      {cardId && (
        <NfcTransactionAuth
          isOpen={showNfcAuth}
          onClose={() => setShowNfcAuth(false)}
          cardId={cardId}
          actionType="send"
          actionData={{
            amount,
            toAddress: recipientAddress,
            fromToken: selectedToken || 'ETH'
          }}
          onAuthorized={(actionPayload) => {
            console.log('Transaction authorized:', actionPayload)
            setShowNfcAuth(false)
            onProceed()
          }}
          onError={(error) => {
            console.error('NFC authorization error:', error)
          }}
        />
      )}
    </Dialog>
  )
}
