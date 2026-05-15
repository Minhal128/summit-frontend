const TWELVE_DATA_API_KEY = '667e11dd204041229d046fcfe8d8ef04'
const TWELVE_DATA_BASE = 'https://api.twelvedata.com'

export interface TwelveDataQuote {
  symbol: string
  price: string
  change: string
  percent_change: string
  volume: string
  is_market_open?: boolean
}

export interface TwelveDataSeriesPoint {
  datetime: string
  close: string
}

function buildSymbol(symbol: string) {
  return `${symbol.toUpperCase()}/USD`
}

async function twelveFetch(path: string) {
  const response = await fetch(`${TWELVE_DATA_BASE}${path}`)
  const data = await response.json()

  if (!response.ok || data?.status === 'error') {
    throw new Error(data?.message || 'Failed to load market data')
  }

  return data
}

export async function getTwelveDataQuote(symbol: string): Promise<TwelveDataQuote> {
  return twelveFetch(`/quote?symbol=${encodeURIComponent(buildSymbol(symbol))}&apikey=${TWELVE_DATA_API_KEY}`)
}

export async function getTwelveDataTimeSeries(symbol: string, interval = '1day', outputsize = 7): Promise<TwelveDataSeriesPoint[]> {
  const data = await twelveFetch(
    `/time_series?symbol=${encodeURIComponent(buildSymbol(symbol))}&interval=${interval}&outputsize=${outputsize}&apikey=${TWELVE_DATA_API_KEY}`
  )

  return Array.isArray(data?.values) ? data.values : []
}