import { type MiniTicker, type MiniTickerResponse } from '../interfaces/miniTicker-interface'

export function transformMiniTicker (miniTicker: MiniTickerResponse): MiniTicker {
  return {
    eventType: miniTicker.e,
    eventTime: miniTicker.E,
    symbol: miniTicker.s,
    curDayClose: miniTicker.c,
    open: miniTicker.o,
    high: miniTicker.h,
    low: miniTicker.l,
    volume: miniTicker.v,
    volumeQuote: miniTicker.q
  }
}

export function transformMiniTickersStream (miniTickers: MiniTickerResponse[]): MiniTicker[] {
  const transformedMiniTickers = miniTickers.map(miniTicker => {
    return {
      eventType: miniTicker.e,
      eventTime: miniTicker.E,
      symbol: miniTicker.s,
      curDayClose: miniTicker.c,
      open: miniTicker.o,
      high: miniTicker.h,
      low: miniTicker.l,
      volume: miniTicker.v,
      volumeQuote: miniTicker.q
    }
  })

  return transformedMiniTickers
}
