import { type CandlesticksRestResponse, type OHLC } from '../interfaces/candlesticks-interface'

export function transformToOHLC (data: CandlesticksRestResponse): OHLC {
  const ohlc: OHLC = {
    open: [],
    high: [],
    low: [],
    close: [],
    volume: []
  }

  for (const tick of data) {
    ohlc.open.push(parseFloat(tick[1]))
    ohlc.high.push(parseFloat(tick[2]))
    ohlc.low.push(parseFloat(tick[3]))
    ohlc.close.push(parseFloat(tick[4]))
    ohlc.volume.push(parseFloat(tick[5]))
  }

  return ohlc
}
