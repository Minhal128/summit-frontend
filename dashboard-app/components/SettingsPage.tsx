"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Send, Download, Zap, Globe, DollarSign, Bell, Shield } from "lucide-react"

interface SettingsPageProps {
  className?: string
}

export default function SettingsPage({ className }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState("Language")
  const [selectedLanguage, setSelectedLanguage] = useState("Default (Device language)")
  const [selectedCurrency, setSelectedCurrency] = useState("USD")
  const [selectedNetworkFee, setSelectedNetworkFee] = useState("Automatic")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [promotionsUpdates, setPromotionsUpdates] = useState(false)

  const languages = ["Default (Device language)", "English", "Chinese", "Francais", "Spanish", "Bengali"]

  const currencies = ["USD", "CAD", "GBP", "EUR", "JPY", "NZD"]

  const networkFees = ["Automatic", "Low", "Medium", "High"]

  const sidebarItems = [
    { id: "Language", label: "Language", icon: "Globe" },
    { id: "Currency", label: "Currency", icon: "DollarSign" },
    { id: "Network Fees", label: "Network Fees", icon: "Zap" },
    { id: "Notification Settings", label: "Notification Settings", icon: "Bell" },
    { id: "Security", label: "Security", icon: "Shield" },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "Language":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl text-white font-bold mb-6">Language</h2>
            {languages.map((language) => (
              <div
                key={language}
                className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors"
              >
                <span className="text-white">{language}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    selectedLanguage === language ? "border-blue-500 bg-blue-500" : "border-gray-400"
                  }`}
                  onClick={() => setSelectedLanguage(language)}
                >
                  {selectedLanguage === language && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
        )

      case "Currency":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl text-white font-bold mb-6">Currency</h2>
            {currencies.map((currency) => (
              <div
                key={currency}
                className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors"
              >
                <span className="text-white">{currency}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    selectedCurrency === currency ? "border-blue-500 bg-blue-500" : "border-gray-400"
                  }`}
                  onClick={() => setSelectedCurrency(currency)}
                >
                  {selectedCurrency === currency && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
        )

      case "Network Fees":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl text-white font-bold mb-6">Network Fees</h2>
            {networkFees.map((fee) => (
              <div
                key={fee}
                className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors"
              >
                <span className="text-white">{fee}</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                    selectedNetworkFee === fee ? "border-blue-500 bg-blue-500" : "border-gray-400"
                  }`}
                  onClick={() => setSelectedNetworkFee(fee)}
                >
                  {selectedNetworkFee === fee && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            ))}
          </div>
        )

      case "Security":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl text-white font-bold mb-6">Security</h2>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Device connection</span>
              </div>
              <span className="text-blue-400 font-medium">Paired</span>
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Two-Factor Authentication</span>
                <p className="text-sm text-gray-400 mt-1">Enable based on 2FA for your account</p>
              </div>
              <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Backup & recovery options</span>
                <p className="text-sm text-gray-400 mt-1">Secure backup of your seed and passphrase</p>
              </div>
            </div>
          </div>
        )

      case "Notification Settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl text-white font-bold mb-6">Notification Settings</h2>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Transaction Alerts</span>
                <p className="text-sm text-gray-400 mt-1">
                  Enable/disable notifications for sent, received, pending, or failed transactions
                </p>
              </div>
              <Switch checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Price Alerts</span>
                <p className="text-sm text-gray-400 mt-1">Get notified when a coin reaches a specific price</p>
              </div>
              <Switch checked={priceAlerts} onCheckedChange={setPriceAlerts} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Security Alerts</span>
                <p className="text-sm text-gray-400 mt-1">
                  Get notified about suspicious transactions, password changes, or suspicious activity
                </p>
              </div>
              <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
            </div>

            <div className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-xl transition-colors">
              <div>
                <span className="text-white font-medium">Promotions & Updates</span>
                <p className="text-sm text-gray-400 mt-1">Opt-in to receive news, offers, or system updates</p>
              </div>
              <Switch checked={promotionsUpdates} onCheckedChange={setPromotionsUpdates} />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`bg-[#0F172A] min-h-screen ${className}`}>
      {/* Header with action buttons */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl text-white font-bold">Settings</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl shadow-lg">
            <Send className="w-4 h-4" /> Send & Receive
          </Button>
          <Button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl shadow-lg">
            <Download className="w-4 h-4" /> Buy & Sell
          </Button>
          <Button className="bg-white text-black font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl shadow-lg">
            <Zap className="w-4 h-4" /> Stake
          </Button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 bg-[#1E293B] rounded-2xl p-4 h-fit">
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent =
                item.icon === "Globe"
                  ? Globe
                  : item.icon === "DollarSign"
                    ? DollarSign
                    : item.icon === "Zap"
                      ? Zap
                      : item.icon === "Bell"
                        ? Bell
                        : Shield

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors w-full text-left ${
                    activeSection === item.id ? "bg-blue-600 text-white" : "hover:bg-slate-700/50 text-gray-300"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#1E293B] rounded-2xl p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
