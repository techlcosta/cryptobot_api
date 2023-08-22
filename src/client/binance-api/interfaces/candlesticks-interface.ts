
export type CandlesticksRestResponse = Array<[
  openTime: number, // Kline open time
  open: string, // Open price
  high: string, // High price
  low: string, // Low price
  close: string, // Close price
  volume: string, // Volume
  closeTime: number, // Kline close time
  quoteVolume: string, // Quote asset volume
  trades: number, // Number of trades
  buyBaseVolume: string, // Taker buy base asset volume
  buyQuoteVolume: string, // Taker buy quote asset volume
  ignore: string // Unused field. Ignore.
]>

export interface CandlesticksStreamResponse {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
  k: {
    t: number // Kline start time
    T: number // Kline close time
    s: string // Symbol
    i: string // Interval
    f: number // First trade ID
    L: number // Last trade ID
    o: string // Open price
    c: string // Close price
    h: string // High price
    l: string // Low price
    v: string // Base asset volume
    n: number // Number of trades
    x: boolean // Is this kline closed?
    q: string // Quote asset volume
    V: string // Taker buy base asset volume
    Q: string // Taker buy quote asset volume
    B: string // Ignore
  }
}

export interface Candlesticks {
  eventType: string
  eventTime: number
  symbol: string
  openTime: number
  closeTime: number
  interval: string
  firstTradeId: number
  lastTradeId: number
  open: string
  close: string
  high: string
  low: string
  volume: string
  trades: number
  isFinal: boolean
  quoteVolume: string
  buyBaseVolume: string
  buyQuoteVolume: string
  ignore: string
}

export interface OHLC {
  open: number[]
  high: number[]
  low: number[]
  close: number[]
  volume: number[]
}
