export interface Token {
  symbol: string
  name: string
  balance: string
  value: string
  icon: string
  color: string
}

export interface ChartDataPoint {
  name: string
  value: number
}

export interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
  }>
  label?: string
}

export interface Network {
  name: string
  symbol: string
  icon: string
}
