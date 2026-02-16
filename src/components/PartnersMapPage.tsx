"use client"

import { useState, useEffect } from "react"
import {
  MapPin,
  Search,
  Globe,
  Users,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  ChevronDown,
  Star,
  Navigation,
  Building2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PartnerLocation {
  id: string
  name: string
  type: "exchange" | "atm" | "merchant" | "agent"
  address: string
  city: string
  country: string
  lat: number
  lng: number
  phone?: string
  email?: string
  website?: string
  commission: number
  totalCards: number
  rating: number
  status: "active" | "inactive"
  services: string[]
  operatingHours: string
}

const PARTNER_LOCATIONS: PartnerLocation[] = [
  {
    id: "p1",
    name: "Summit Exchange HQ",
    type: "exchange",
    address: "1 Raffles Place, Tower 1",
    city: "Singapore",
    country: "Singapore",
    lat: 1.2839,
    lng: 103.8515,
    phone: "+65 6123 4567",
    email: "sg@summitexchange.net",
    website: "https://summitexchange.net",
    commission: 5.0,
    totalCards: 500,
    rating: 5.0,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading", "Customer Support"],
    operatingHours: "Mon-Fri: 9am-6pm",
  },
  {
    id: "p2",
    name: "Summit KL Branch",
    type: "exchange",
    address: "Menara KLCC, Jalan Ampang",
    city: "Kuala Lumpur",
    country: "Malaysia",
    lat: 3.1579,
    lng: 101.7116,
    phone: "+60 3-2181 1234",
    email: "kl@summitexchange.net",
    commission: 6.0,
    totalCards: 320,
    rating: 4.8,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading"],
    operatingHours: "Mon-Fri: 9am-6pm",
  },
  {
    id: "p3",
    name: "Summit Bangkok Office",
    type: "exchange",
    address: "Silom Complex, Silom Road",
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7279,
    lng: 100.5214,
    phone: "+66 2-234-5678",
    email: "bkk@summitexchange.net",
    commission: 5.5,
    totalCards: 280,
    rating: 4.7,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "Exchange"],
    operatingHours: "Mon-Sat: 10am-7pm",
  },
  {
    id: "p4",
    name: "Summit Jakarta Partner",
    type: "agent",
    address: "Sudirman Central Business District",
    city: "Jakarta",
    country: "Indonesia",
    lat: -6.2253,
    lng: 106.8022,
    phone: "+62 21-5555-1234",
    email: "jakarta@summitexchange.net",
    commission: 7.0,
    totalCards: 150,
    rating: 4.5,
    status: "active",
    services: ["Buy/Sell", "NFC Cards"],
    operatingHours: "Mon-Fri: 9am-5pm",
  },
  {
    id: "p5",
    name: "Summit Hong Kong",
    type: "exchange",
    address: "Central Tower, Des Voeux Road",
    city: "Hong Kong",
    country: "Hong Kong",
    lat: 22.2832,
    lng: 114.1588,
    phone: "+852 2888 1234",
    email: "hk@summitexchange.net",
    commission: 4.5,
    totalCards: 400,
    rating: 4.9,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading", "Lending"],
    operatingHours: "Mon-Fri: 8:30am-5:30pm",
  },
  {
    id: "p6",
    name: "Summit Dubai",
    type: "exchange",
    address: "DIFC, Sheikh Zayed Road",
    city: "Dubai",
    country: "UAE",
    lat: 25.2119,
    lng: 55.2798,
    phone: "+971 4-555-1234",
    email: "dubai@summitexchange.net",
    commission: 5.0,
    totalCards: 350,
    rating: 4.8,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading", "VIP Service"],
    operatingHours: "Sun-Thu: 9am-6pm",
  },
  {
    id: "p7",
    name: "Summit Tokyo",
    type: "exchange",
    address: "Marunouchi, Chiyoda-ku",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6815,
    lng: 139.7671,
    phone: "+81 3-1234-5678",
    email: "tokyo@summitexchange.net",
    commission: 4.0,
    totalCards: 450,
    rating: 4.9,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "DEX", "Lending"],
    operatingHours: "Mon-Fri: 9am-6pm",
  },
  {
    id: "p8",
    name: "Summit London",
    type: "exchange",
    address: "Canary Wharf, London",
    city: "London",
    country: "United Kingdom",
    lat: 51.5054,
    lng: -0.0235,
    phone: "+44 20-7123-4567",
    email: "london@summitexchange.net",
    commission: 4.5,
    totalCards: 380,
    rating: 4.7,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading"],
    operatingHours: "Mon-Fri: 8am-5pm",
  },
  {
    id: "p9",
    name: "Summit Sydney",
    type: "agent",
    address: "George Street, Sydney CBD",
    city: "Sydney",
    country: "Australia",
    lat: -33.867,
    lng: 151.207,
    phone: "+61 2-9876-5432",
    email: "sydney@summitexchange.net",
    commission: 6.0,
    totalCards: 200,
    rating: 4.6,
    status: "active",
    services: ["Buy/Sell", "NFC Cards"],
    operatingHours: "Mon-Fri: 9am-5pm",
  },
  {
    id: "p10",
    name: "Summit Mumbai",
    type: "agent",
    address: "Bandra Kurla Complex",
    city: "Mumbai",
    country: "India",
    lat: 19.0596,
    lng: 72.8656,
    phone: "+91 22-4567-8901",
    email: "mumbai@summitexchange.net",
    commission: 7.5,
    totalCards: 180,
    rating: 4.4,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "P2P Trading"],
    operatingHours: "Mon-Sat: 10am-6pm",
  },
  {
    id: "p11",
    name: "Summit Seoul",
    type: "exchange",
    address: "Gangnam-gu, Seoul",
    city: "Seoul",
    country: "South Korea",
    lat: 37.4979,
    lng: 127.0276,
    phone: "+82 2-555-1234",
    email: "seoul@summitexchange.net",
    commission: 4.5,
    totalCards: 350,
    rating: 4.8,
    status: "active",
    services: ["Buy/Sell", "NFC Cards", "DEX", "P2P Trading"],
    operatingHours: "Mon-Fri: 9am-6pm",
  },
  {
    id: "p12",
    name: "Summit Manila Agent",
    type: "agent",
    address: "Makati City, Metro Manila",
    city: "Manila",
    country: "Philippines",
    lat: 14.5547,
    lng: 121.0244,
    phone: "+63 2-8888-1234",
    email: "manila@summitexchange.net",
    commission: 8.0,
    totalCards: 120,
    rating: 4.3,
    status: "active",
    services: ["Buy/Sell", "NFC Cards"],
    operatingHours: "Mon-Fri: 9am-5pm",
  },
]

const TYPE_COLORS = {
  exchange: "bg-blue-500",
  atm: "bg-green-500",
  merchant: "bg-purple-500",
  agent: "bg-orange-500",
}

const TYPE_LABELS = {
  exchange: "Exchange Office",
  atm: "Crypto ATM",
  merchant: "Merchant Partner",
  agent: "Authorized Agent",
}

export default function PartnersMapPage({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedPartner, setSelectedPartner] = useState<PartnerLocation | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredPartners = PARTNER_LOCATIONS.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || partner.type === selectedType
    return matchesSearch && matchesType
  })

  const stats = {
    totalPartners: PARTNER_LOCATIONS.length,
    totalCountries: new Set(PARTNER_LOCATIONS.map((p) => p.country)).size,
    totalCards: PARTNER_LOCATIONS.reduce((sum, p) => sum + p.totalCards, 0),
    activePartners: PARTNER_LOCATIONS.filter((p) => p.status === "active").length,
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl text-white font-bold flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-400" />
          Partner Network
        </h2>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalPartners}</p>
              <p className="text-xs text-gray-400">Total Partners</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCountries}</p>
              <p className="text-xs text-gray-400">Countries</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalCards.toLocaleString()}</p>
              <p className="text-xs text-gray-400">NFC Cards Distributed</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.activePartners}</p>
              <p className="text-xs text-gray-400">Active Partners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Map Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search partners by name, city, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="border-slate-700 text-gray-400"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>
              {showFilters && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {["all", "exchange", "atm", "merchant", "agent"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedType === type
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-gray-400 hover:bg-slate-700"
                      }`}
                    >
                      {type === "all" ? "All Types" : TYPE_LABELS[type as keyof typeof TYPE_LABELS]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* World Map Visualization */}
            <div className="relative bg-slate-900/50 p-6" style={{ minHeight: "500px" }}>
              {/* SVG World Map */}
              <svg viewBox="0 0 1000 500" className="w-full h-full" style={{ minHeight: "460px" }}>
                {/* World Map simplified contours */}
                <defs>
                  <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Simplified continent outlines */}
                {/* North America */}
                <path d="M150,80 L180,60 L220,70 L260,90 L270,130 L250,180 L220,200 L200,220 L180,210 L160,180 L140,150 L130,120 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* South America */}
                <path d="M220,240 L250,230 L280,260 L290,300 L280,350 L260,380 L240,390 L230,370 L220,330 L210,290 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Europe */}
                <path d="M430,60 L470,50 L510,60 L530,80 L520,110 L500,120 L480,130 L450,120 L430,100 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Africa */}
                <path d="M450,150 L490,140 L520,160 L530,200 L520,260 L500,300 L480,320 L460,310 L450,280 L440,230 L440,190 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Asia */}
                <path d="M540,50 L600,40 L680,50 L750,70 L790,100 L780,140 L750,160 L700,170 L660,150 L620,140 L580,130 L550,100 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Middle East */}
                <path d="M530,120 L570,110 L590,130 L580,160 L560,170 L540,160 L530,140 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Southeast Asia */}
                <path d="M700,170 L750,160 L790,180 L800,210 L780,230 L750,220 L720,210 L700,200 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />
                {/* Australia */}
                <path d="M760,300 L820,290 L860,310 L850,350 L820,370 L780,360 L760,340 Z"
                  fill="#1E293B" stroke="#334155" strokeWidth="1" />

                {/* Connection lines between partners */}
                {filteredPartners.map((partner, i) => {
                  if (i === 0) return null
                  const hq = filteredPartners[0]
                  const x1 = ((hq.lng + 180) / 360) * 1000
                  const y1 = ((90 - hq.lat) / 180) * 500
                  const x2 = ((partner.lng + 180) / 360) * 1000
                  const y2 = ((90 - partner.lat) / 180) * 500
                  return (
                    <line
                      key={`line-${partner.id}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#3B82F6"
                      strokeWidth="0.5"
                      strokeOpacity="0.3"
                      strokeDasharray="4 4"
                    />
                  )
                })}

                {/* Partner location pins */}
                {filteredPartners.map((partner) => {
                  const x = ((partner.lng + 180) / 360) * 1000
                  const y = ((90 - partner.lat) / 180) * 500
                  const isSelected = selectedPartner?.id === partner.id
                  return (
                    <g
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner)}
                      className="cursor-pointer"
                    >
                      {/* Glow effect */}
                      <circle cx={x} cy={y} r={isSelected ? 20 : 12} fill="url(#pinGlow)" opacity={isSelected ? 1 : 0.5} />
                      {/* Pin dot */}
                      <circle
                        cx={x} cy={y}
                        r={isSelected ? 8 : 5}
                        fill={partner.type === "exchange" ? "#3B82F6" : partner.type === "agent" ? "#F59E0B" : "#10B981"}
                        stroke="#fff"
                        strokeWidth={isSelected ? 2 : 1}
                        className="transition-all duration-200"
                      />
                      {/* Label */}
                      {isSelected && (
                        <text
                          x={x}
                          y={y - 16}
                          textAnchor="middle"
                          fill="#fff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {partner.city}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
                <p className="text-xs text-gray-400 font-medium mb-2">Partner Types</p>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-300">Exchange Office</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-gray-300">Authorized Agent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-300">Merchant / ATM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Partner List */}
        <div className="lg:col-span-1">
          <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">
                Partners ({filteredPartners.length})
              </h3>
            </div>
            <div className="divide-y divide-slate-700/50 max-h-[580px] overflow-y-auto">
              {filteredPartners.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full p-4 text-left transition-all hover:bg-slate-800/50 ${
                    selectedPartner?.id === partner.id ? "bg-blue-600/10 border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${TYPE_COLORS[partner.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{partner.name}</p>
                      <p className="text-gray-400 text-xs">{partner.city}, {partner.country}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          partner.type === "exchange" ? "bg-blue-500/20 text-blue-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {TYPE_LABELS[partner.type]}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-gray-400">{partner.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Partner Detail */}
          {selectedPartner && (
            <div className="bg-[#1E293B] rounded-2xl border border-slate-700/50 mt-4 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${TYPE_COLORS[selectedPartner.type]} rounded-xl flex items-center justify-center`}>
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{selectedPartner.name}</h4>
                  <p className="text-gray-400 text-sm">{TYPE_LABELS[selectedPartner.type]}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-300">{selectedPartner.address}, {selectedPartner.city}, {selectedPartner.country}</p>
                </div>
                {selectedPartner.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-300">{selectedPartner.phone}</p>
                  </div>
                )}
                {selectedPartner.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-blue-400">{selectedPartner.email}</p>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-300">{selectedPartner.totalCards} NFC cards distributed</p>
                </div>

                <div className="pt-3 border-t border-slate-700/50">
                  <p className="text-xs text-gray-400 mb-2">Services Available</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.services.map((service) => (
                      <span key={service} className="px-2 py-1 bg-slate-800 rounded text-xs text-gray-300">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Commission</p>
                      <p className="text-lg font-bold text-white">{selectedPartner.commission}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <p className="text-lg font-bold text-white">{selectedPartner.rating}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="text-xs text-gray-400 mb-1">Operating Hours</p>
                  <p className="text-sm text-gray-300">{selectedPartner.operatingHours}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
