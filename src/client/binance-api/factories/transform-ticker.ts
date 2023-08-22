import { type Ticker, type TickerResponse } from '../interfaces/ticker-interface'

export function transformTicker (ticker: TickerResponse): Ticker {
  return {
    eventType: ticker.e,
    eventTime: ticker.E,
    symbol: ticker.s,
    priceChange: ticker.p,
    priceChangePercent: ticker.P,
    weightedAvg: ticker.w,
    prevDayClose: ticker.x,
    lastPrice: ticker.c,
    lastQuantity: ticker.Q,
    bestBid: ticker.b,
    bestBidQnt: ticker.B,
    bestAsk: ticker.a,
    bestAskQnt: ticker.A,
    open: ticker.o,
    high: ticker.h,
    low: ticker.l,
    volume: ticker.v,
    volumeQuote: ticker.q,
    openTime: ticker.O,
    closeTime: ticker.C,
    firstTradeId: ticker.F,
    lastTradeId: ticker.L,
    totalTrades: ticker.n
  }
}

export function transformTickersStream (tickers: TickerResponse[]): Ticker[] {
  const transformedTickers = tickers.map(ticker => {
    return {
      eventType: ticker.e,
      eventTime: ticker.E,
      symbol: ticker.s,
      priceChange: ticker.p,
      priceChangePercent: ticker.P,
      weightedAvg: ticker.w,
      prevDayClose: ticker.x,
      lastPrice: ticker.c,
      lastQuantity: ticker.Q,
      bestBid: ticker.b,
      bestBidQnt: ticker.B,
      bestAsk: ticker.a,
      bestAskQnt: ticker.A,
      open: ticker.o,
      high: ticker.h,
      low: ticker.l,
      volume: ticker.v,
      volumeQuote: ticker.q,
      openTime: ticker.O,
      closeTime: ticker.C,
      firstTradeId: ticker.F,
      lastTradeId: ticker.L,
      totalTrades: ticker.n
    }
  })

  return transformedTickers
}
