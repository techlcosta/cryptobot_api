import { type Indexes } from '@prisma/client'

export interface StartSpotCandlestickInput {
  apiURL: string
  streamURL: string
  user_id: string
  symbol: string
  interval: string
  indexes: Indexes[]
}

export interface StartSpotUserDataInput {
  apiURL: string
  apiKey: string
  streamURL: string
  user_id: string
}

export interface BinanceExchangeActionsInterface {
  startSpotTicker: () => Promise<void>
  startSpotMiniTicker: () => Promise<void>
  startSpotCandlestick: (data: StartSpotCandlestickInput) => Promise<void>
  startSpotUserData: (data: StartSpotUserDataInput) => Promise<void>
}
