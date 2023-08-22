import { type OHLC } from '../interfaces/candlesticks-interface'
import { type MiniTicker } from '../interfaces/miniTicker-interface'
import { type Ticker } from '../interfaces/ticker-interface'
import { type UserDataStreamEvent } from '../interfaces/userData-interface'

export interface TickerStreamInput {
  streamURL?: string
  tickers: (data: Ticker[]) => void
}

export interface MiniTickerStreamInput {
  streamURL?: string
  miniTickers: (data: MiniTicker[]) => void
}

export interface CandlestickStreamInput {
  streamURL?: string
  apiURL?: string
  interval: string
  symbol: string
  candlesticks: (ohlc: OHLC) => void
}

export interface UserDataStreamInput {
  streamURL?: string
  apiURL?: string
  apiKey: string
  userData: (data: UserDataStreamEvent | null) => Promise<void>
}

export interface BinanceStreamInterface {
  tickerStream: (data: TickerStreamInput) => void
  miniTickerStream: (data: MiniTickerStreamInput) => void
  candlestickStream: (data: CandlestickStreamInput) => void
  userDataStream: (data: UserDataStreamInput) => void
}
