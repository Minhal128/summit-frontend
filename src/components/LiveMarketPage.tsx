'use client';

import { Search } from 'lucide-react';
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// --- TYPE DEFINITIONS ---
interface Coin {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  price: number;
  marketCap: string;
  change7d: number;
  chartData: { value: number }[];
  chartColor: string;
}

// --- MOCK DATA ---
// Helper to generate random chart data
const generateChartData = () => Array.from({ length: 20 }, () => ({ value: Math.random() * 100 }));

const coinData: Coin[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'Btc/USDT', icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH/USDT', icon: <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center font-bold text-white text-sm">E</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#FBBF24' },
  { id: 'sol', name: 'Solana', symbol: 'Sol/USDT', icon: <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm">S</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'ton', name: 'Ton', symbol: 'Ton/USDT', icon: <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold text-white text-sm">T</div>, price: 110738, marketCap: '20B', change7d: -1.56, chartData: generateChartData(), chartColor: '#F87171' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-sm">T</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'btc2', name: 'Bitcoin', symbol: 'Btc/USDT', icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'btc3', name: 'Bitcoin', symbol: 'Btc/USDT', icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'btc4', name: 'Bitcoin', symbol: 'Btc/USDT', icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>, price: 110738, marketCap: '20B', change7d: 1.56, chartData: generateChartData(), chartColor: '#60A5FA' },
];

// --- MAIN COMPONENT ---
interface LiveMarketPageProps {
  className?: string;
}

const LiveMarketPage: React.FC<LiveMarketPageProps> = ({ className = '' }) => {
  return (
    <div className={`bg-[#1E293B] p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-700/50 w-full ${className}`}>
      {/* Header: Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search Coins" 
            className="w-full bg-[#0F172A] border border-slate-700 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-white"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {coinData.map((coin) => (
          <div key={coin.id} className="bg-[#0F172A] border border-slate-700 rounded-xl p-4 hover:bg-slate-700/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {coin.icon}
                <div>
                  <p className="font-bold text-white text-base">{coin.name}</p>
                  <p className="text-sm text-gray-400">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white text-base">${coin.price.toLocaleString()}</p>
                <p className={`text-sm font-medium ${coin.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change7d >= 0 ? '+' : ''}{coin.change7d.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Market Cap: <span className="text-white">${coin.marketCap}</span></span>
              <div className="w-20 h-8">
                <ResponsiveContainer>
                  <LineChart data={coin.chartData}>
                    <Line type="monotone" dataKey="value" stroke={coin.chartColor} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-400 border-b border-slate-700">
              <th className="p-4 font-semibold text-left">Coin</th>
              <th className="p-4 font-semibold text-left">Price</th>
              <th className="p-4 font-semibold text-left hidden md:table-cell">Market Cap</th>
              <th className="p-4 font-semibold text-left">Change (7D)</th>
              <th className="p-4 font-semibold text-right hidden lg:table-cell">Chart</th>
            </tr>
          </thead>
          <tbody>
            {coinData.map((coin) => (
              <tr key={coin.id} className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors">
                {/* Coin Info */}
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {coin.icon}
                    <div>
                      <p className="font-bold text-white text-base">{coin.name}</p>
                      <p className="text-sm text-gray-400">{coin.symbol}</p>
                    </div>
                  </div>
                </td>
                {/* Price */}
                <td className="p-4 font-semibold text-white text-base">${coin.price.toLocaleString()}</td>
                {/* Market Cap */}
                <td className="p-4 font-medium text-white text-base hidden md:table-cell">${coin.marketCap}</td>
                {/* Change */}
                <td className={`p-4 font-semibold text-base ${coin.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {coin.change7d >= 0 ? '+' : ''}{coin.change7d.toFixed(2)}%
                </td>
                {/* Chart */}
                <td className="p-4 hidden lg:table-cell">
                  <div className="w-32 h-10 ml-auto">
                    <ResponsiveContainer>
                      <LineChart data={coin.chartData}>
                        <Line type="monotone" dataKey="value" stroke={coin.chartColor} strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveMarketPage;
