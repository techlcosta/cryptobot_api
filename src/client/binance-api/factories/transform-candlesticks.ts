import { type Candlesticks, type CandlesticksStreamResponse } from '../interfaces/candlesticks-interface'

export default function transformCandlesticks (data: CandlesticksStreamResponse): Candlesticks {
  const transformed = {
    eventType: data.e,
    eventTime: data.E,
    symbol: data.s,
    openTime: data.k.t,
    closeTime: data.k.T,
    interval: data.k.i,
    firstTradeId: data.k.f,
    lastTradeId: data.k.L,
    open: data.k.o,
    close: data.k.c,
    high: data.k.h,
    low: data.k.l,
    volume: data.k.v,
    trades: data.k.n,
    isFinal: data.k.x,
    quoteVolume: data.k.q,
    buyBaseVolume: data.k.V,
    buyQuoteVolume: data.k.Q,
    ignore: data.k.B
  }

  return transformed
}
