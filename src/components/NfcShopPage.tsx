"use client"

import { useState, useEffect } from "react"
import {
  CreditCard,
  ShoppingCart,
  Check,
  Shield,
  Zap,
  Star,
  Package,
  Truck,
  Lock,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getMarketRates } from "@/lib/exchangeApi"

const NFC_PRODUCTS = [
  {
    id: "basic",
    name: "Basic NFC Card",
    price: 29.99,
    originalPrice: 39.99,
    tier: "Basic",
    color: "from-gray-500 to-gray-600",
    features: [
      "Secure NFC authentication",
      "Transaction signing",
      "1 wallet support",
      "Basic security features",
      "1-year warranty",
    ],
    stock: 150,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium NFC Card",
    price: 59.99,
    originalPrice: 79.99,
    tier: "Premium",
    color: "from-blue-500 to-blue-600",
    features: [
      "Advanced NFC authentication",
      "Multi-signature support",
      "3 wallet support",
      "Enhanced security",
      "Priority support",
      "2-year warranty",
    ],
    stock: 89,
    popular: true,
  },
  {
    id: "elite",
    name: "Elite NFC Card",
    price: 99.99,
    originalPrice: 129.99,
    tier: "Elite",
    color: "from-purple-500 to-purple-600",
    features: [
      "Premium NFC authentication",
      "Unlimited wallets",
      "Biometric integration",
      "Maximum security",
      "24/7 VIP support",
      "Lifetime warranty",
      "Custom engraving",
    ],
    stock: 45,
    popular: false,
  },
]

export default function NfcShopPage({ className }: { className?: string }) {
  const [selectedProduct, setSelectedProduct] = useState<typeof NFC_PRODUCTS[0] | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [cryptoRates, setCryptoRates] = useState<Record<string, number>>({})
  const [ratesLoading, setRatesLoading] = useState(true)
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  })

  useEffect(() => {
    loadCryptoRates()
    const interval = setInterval(loadCryptoRates, 60000) // refresh every minute
    return () => clearInterval(interval)
  }, [])

  const loadCryptoRates = async () => {
    try {
      const res = await getMarketRates()
      const rates: Record<string, number> = {}
      if (res.data) {
        res.data.forEach((r: any) => {
          if (r.price) rates[r.symbol?.toUpperCase()] = r.price
        })
      }
      if (Object.keys(rates).length > 0) setCryptoRates(rates)
    } catch (err) {
      console.error("Failed to load crypto rates:", err)
    } finally {
      setRatesLoading(false)
    }
  }

  const getCryptoEquivalent = (usdPrice: number, symbol: string) => {
    const rate = cryptoRates[symbol]
    if (!rate || rate === 0) return null
    return (usdPrice / rate).toFixed(symbol === 'BTC' ? 6 : 4)
  }

  const calculateTotal = () => {
    if (!selectedProduct) return 0
    return selectedProduct.price * quantity
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-blue-400" />
          NFC Card Shop
        </h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4 text-green-400" />
          Secure Payment & Fast Shipping
        </div>
      </div>

      {/* Benefits Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <Shield className="w-8 h-8 text-green-400" />
          <div>
            <p className="text-white font-semibold">Secure</p>
            <p className="text-gray-400 text-xs">Bank-level encryption</p>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <Truck className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-white font-semibold">Fast Shipping</p>
            <p className="text-gray-400 text-xs">3-5 business days</p>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <Lock className="w-8 h-8 text-purple-400" />
          <div>
            <p className="text-white font-semibold">Warranty</p>
            <p className="text-gray-400 text-xs">Up to lifetime</p>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50 flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-400" />
          <div>
            <p className="text-white font-semibold">Instant Setup</p>
            <p className="text-gray-400 text-xs">Ready in minutes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {NFC_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className={`bg-[#1E293B] rounded-2xl p-6 border transition-all cursor-pointer relative ${
                selectedProduct?.id === product.id
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-slate-700/50 hover:border-slate-600"
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              {product.popular && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" /> POPULAR
                </div>
              )}

              {/* Card Visual */}
              <div className={`w-full h-40 bg-gradient-to-br ${product.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <CreditCard className="w-16 h-16 text-white/80" />
                <div className="absolute bottom-3 left-3 text-white/90 font-bold text-sm">
                  {product.tier}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-white">${product.price}</span>
                <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                <span className="text-green-400 text-sm font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>

              {/* Live Crypto Equivalents */}
              {!ratesLoading && Object.keys(cryptoRates).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {getCryptoEquivalent(product.price, 'BTC') && (
                    <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-xs font-medium">
                      ₿ {getCryptoEquivalent(product.price, 'BTC')} BTC
                    </span>
                  )}
                  {getCryptoEquivalent(product.price, 'ETH') && (
                    <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 text-xs font-medium">
                      Ξ {getCryptoEquivalent(product.price, 'ETH')} ETH
                    </span>
                  )}
                  {getCryptoEquivalent(product.price, 'USDT') && (
                    <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">
                      {getCryptoEquivalent(product.price, 'USDT')} USDT
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2 mb-4">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">{product.stock} in stock</span>
                </div>
                {selectedProduct?.id === product.id && (
                  <Check className="w-6 h-6 text-blue-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-slate-700/50 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Summary
            </h3>

            {selectedProduct ? (
              <>
                <div className="mb-4 p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{selectedProduct.name}</span>
                    <span className="text-white font-bold">${selectedProduct.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-gray-400 text-sm">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(selectedProduct.stock, parseInt(e.target.value) || 1)))}
                      className="w-20 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <Input
                    placeholder="Full Name"
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    placeholder="Address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="City"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <Input
                      placeholder="ZIP"
                      value={shippingInfo.zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <Input
                    placeholder="Country"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2 mb-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${(selectedProduct.price * quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">${(calculateTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold text-xl">${(calculateTotal() * 1.1).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-bold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Proceed to Payment
                </Button>

                <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs">
                  <Shield className="w-4 h-4" />
                  <p>Secure checkout powered by Stripe</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Select a card to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
