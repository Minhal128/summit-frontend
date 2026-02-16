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
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC/USDT', icon: <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-white text-sm">₿</div>, price: 110738, marketCap: '2.1T', change7d: 1.56, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH/USDT', icon: <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold text-white text-sm">Ξ</div>, price: 3245, marketCap: '390B', change7d: 2.34, chartData: generateChartData(), chartColor: '#FBBF24' },
  { id: 'bnb', name: 'BNB', symbol: 'BNB/USDT', icon: <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>, price: 645, marketCap: '94B', change7d: 0.89, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'sol', name: 'Solana', symbol: 'SOL/USDT', icon: <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-green-400 rounded-full flex items-center justify-center font-bold text-white text-sm">◎</div>, price: 178, marketCap: '82B', change7d: 3.45, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'xrp', name: 'Ripple', symbol: 'XRP/USDT', icon: <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center font-bold text-white text-sm">X</div>, price: 0.62, marketCap: '35B', change7d: -0.45, chartData: generateChartData(), chartColor: '#F87171' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC/USDT', icon: <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">$</div>, price: 1.00, marketCap: '32B', change7d: 0.01, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'ada', name: 'Cardano', symbol: 'ADA/USDT', icon: <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">₳</div>, price: 0.58, marketCap: '20B', change7d: 1.23, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE/USDT', icon: <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center font-bold text-white text-sm">Ð</div>, price: 0.15, marketCap: '22B', change7d: 4.56, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'trx', name: 'TRON', symbol: 'TRX/USDT', icon: <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center font-bold text-white text-sm">T</div>, price: 0.24, marketCap: '21B', change7d: 0.67, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'ton', name: 'Toncoin', symbol: 'TON/USDT', icon: <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center font-bold text-white text-sm">T</div>, price: 5.42, marketCap: '18B', change7d: -1.56, chartData: generateChartData(), chartColor: '#F87171' },
  { id: 'dot', name: 'Polkadot', symbol: 'DOT/USDT', icon: <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center font-bold text-white text-sm">•</div>, price: 7.89, marketCap: '11B', change7d: 2.11, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC/USDT', icon: <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">M</div>, price: 0.89, marketCap: '8.3B', change7d: 1.78, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC/USDT', icon: <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center font-bold text-white text-sm">Ł</div>, price: 98.45, marketCap: '7.2B', change7d: 0.92, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'avax', name: 'Avalanche', symbol: 'AVAX/USDT', icon: <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center font-bold text-white text-sm">A</div>, price: 42.67, marketCap: '16B', change7d: 3.21, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'link', name: 'Chainlink', symbol: 'LINK/USDT', icon: <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center font-bold text-white text-sm">⬡</div>, price: 18.92, marketCap: '11B', change7d: 1.45, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'uni', name: 'Uniswap', symbol: 'UNI/USDT', icon: <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center font-bold text-white text-sm">U</div>, price: 11.23, marketCap: '6.8B', change7d: 2.67, chartData: generateChartData(), chartColor: '#34D399' },
  { id: 'atom', name: 'Cosmos', symbol: 'ATOM/USDT', icon: <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-sm">⚛</div>, price: 12.45, marketCap: '4.5B', change7d: 1.89, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'xlm', name: 'Stellar', symbol: 'XLM/USDT', icon: <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center font-bold text-white text-sm">✦</div>, price: 0.13, marketCap: '3.8B', change7d: 0.56, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'algo', name: 'Algorand', symbol: 'ALGO/USDT', icon: <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white text-sm">A</div>, price: 0.34, marketCap: '2.7B', change7d: 1.12, chartData: generateChartData(), chartColor: '#60A5FA' },
  { id: 'vet', name: 'VeChain', symbol: 'VET/USDT', icon: <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center font-bold text-white text-sm">V</div>, price: 0.045, marketCap: '3.3B', change7d: 0.78, chartData: generateChartData(), chartColor: '#60A5FA' },
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
