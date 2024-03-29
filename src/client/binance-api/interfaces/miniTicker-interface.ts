
export interface MiniTickerResponse {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  c: string // Close price
  o: string // Open price
  h: string // High price
  l: string // Low price
  v: string // Total traded base asset volume
  q: string // Total traded quote asset volume
}

export interface MiniTicker {
  eventType: string
  eventTime: number
  symbol: string
  curDayClose: string
  open: string
  high: string
  low: string
  volume: string
  volumeQuote: string
}
