"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { ArrowLeft, X, CreditCard } from "lucide-react"
import { useState } from "react"

interface SellCoinModalProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  selectedToken?: string
  onProceed: () => void
}

export default function SellCoinModal({ isOpen, onClose, onBack, selectedToken, onProceed }: SellCoinModalProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")

  const getTokenIcon = (token?: string) => {
    switch (token) {
      case "BTC":
        return "₿"
      case "ETH":
        return "Ξ"
      case "SOL":
        return "◎"
      case "TON":
        return "💎"
      case "USDT":
        return "₮"
      default:
        return "₿"
    }
  }

  const getTokenColor = (token?: string) => {
    switch (token) {
      case "BTC":
        return "bg-orange-500"
      case "ETH":
        return "bg-blue-500"
      case "SOL":
        return "bg-black"
      case "TON":
        return "bg-blue-600"
      case "USDT":
        return "bg-green-500"
      default:
        return "bg-orange-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E293B] border-slate-700 text-white max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-xl font-bold">Sell coin</DialogTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-8">
          <div className="text-right">
            <label className="text-sm text-gray-400 block mb-2">Amount</label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent border-none text-right text-2xl font-bold text-white placeholder:text-gray-600 p-0 h-auto"
            />
          </div>

          <div className="space-y-4">
            <Select defaultValue={selectedToken?.toLowerCase()}>
              <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white h-16 px-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${getTokenColor(selectedToken)} rounded-full flex items-center justify-center font-bold text-white text-lg`}
                  >
                    {getTokenIcon(selectedToken)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-base">{selectedToken}</p>
                    <p className="text-sm text-gray-400">
                      {selectedToken === "BTC" ? "Bitcoin" : selectedToken === "ETH" ? "Ethereum" : "Solana"}
                    </p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-slate-700">
                <SelectItem value="btc">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ₿
                    </div>
                    <span>Bitcoin</span>
                  </div>
                </SelectItem>
                <SelectItem value="eth">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      Ξ
                    </div>
                    <span>Ethereum</span>
                  </div>
                </SelectItem>
                <SelectItem value="sol">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ◎
                    </div>
                    <span>Solana</span>
                  </div>
                </SelectItem>
                <SelectItem value="ton">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      💎
                    </div>
                    <span>Toncoin</span>
                  </div>
                </SelectItem>
                <SelectItem value="usdt">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      ₮
                    </div>
                    <span>USDT</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white h-16 px-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-yellow-500" />
                  <div className="text-left">
                    <p className="font-medium text-base">Receive with</p>
                    <p className="text-sm text-gray-400">Credit card</p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-slate-700">
                <SelectItem value="credit-card">Credit card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={onProceed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl text-base"
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
