import { type RawData } from 'ws'
import transformCandlesticks from '../factories/transform-candlesticks'
import { transformMiniTickersStream } from '../factories/transform-miniTicker'
import { transformTickersStream } from '../factories/transform-ticker'
import { transformToOHLC } from '../factories/transform-toOHLC'
import { transformUserData } from '../factories/trasnform-userData'
import { type CandlesticksRestResponse } from '../interfaces/candlesticks-interface'
import { WebSocketConnection } from '../utils/websocket-connection'
import {
  type BinanceStreamInterface,
  type CandlestickStreamInput,
  type MiniTickerStreamInput,
  type TickerStreamInput,
  type UserDataStreamInput
} from './binanceStream-interface'

type LastCandle = [
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
]

class _BinanceStream extends WebSocketConnection implements BinanceStreamInterface {
  private readonly spotStreamURL = 'wss://stream.binance.com:9443/ws/'
  private readonly apiURL = 'https://api.binance.com/api/'
  private listenKey: string | undefined
  private readonly candles = new Map<string, CandlesticksRestResponse>()
  private static readonly binanceStreamInstances = new Map<string, _BinanceStream>()

  private constructor () {
    super()
  }

  static getInstance (user_id?: string): _BinanceStream {
    if (user_id) {
      const currentInstance = _BinanceStream.binanceStreamInstances.get(user_id)

      if (currentInstance) {
        return currentInstance
      } else {
        const binanceStreamInstance = new _BinanceStream()
        _BinanceStream.binanceStreamInstances.set(user_id, binanceStreamInstance)

        return binanceStreamInstance
      }
    } else {
      return new _BinanceStream()
    }
  }

  tickerStream ({ streamURL, tickers }: TickerStreamInput): void {
    const URL = streamURL ?? this.spotStreamURL

    const endpoint = '!ticker@arr'

    const ID = `spot:${endpoint}`

    const reconnectFn = (): void => { this.tickerStream({ streamURL, tickers }) }

    const callback = function (data: RawData): void {
      if (Buffer.isBuffer(data)) tickers(transformTickersStream(JSON.parse(data.toString())))
    }

    this.subscribe({ streamURL: URL, endpoint, reconnectFn, callback, ID })
  }

  miniTickerStream ({ streamURL, miniTickers }: MiniTickerStreamInput): void {
    const URL = streamURL ?? this.spotStreamURL

    const endpoint = '!miniTicker@arr'

    const ID = `spot:${endpoint}`

    const reconnectFn = (): void => { this.miniTickerStream({ streamURL, miniTickers }) }

    const callback = function (data: RawData): void {
      if (Buffer.isBuffer(data)) miniTickers(transformMiniTickersStream(JSON.parse(data.toString())))
    }

    this.subscribe({ streamURL: URL, endpoint, reconnectFn, callback, ID })
  }

  candlestickStream ({ streamURL, apiURL, symbol, interval, candlesticks }: CandlestickStreamInput): void {
    const candles = this.candles
    const endpointStream = `${symbol.toLowerCase()}@kline_${interval}`
    const endpointRequest = `v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}`
    const ID = `spot:${endpointStream}`

    const request = async (): Promise<void> => {
      const response = await this.publicRequest({ apiURL: apiURL ?? this.apiURL, endpoint: endpointRequest, method: 'GET' })

      if (response) candles.set(endpointStream, response)
    }

    const reconnectFn = (): void => {
      candles.delete(endpointStream)
      this.candlestickStream({ streamURL, apiURL, symbol, interval, candlesticks })
    }

    const callback = function (data: RawData): void {
      if (Buffer.isBuffer(data)) {
        const current = candles.get(endpointStream)
        const tick = transformCandlesticks(JSON.parse(data.toString()))

        const lastCandle: LastCandle = [
          tick.openTime,
          tick.open,
          tick.high,
          tick.low,
          tick.close,
          tick.volume,
          tick.closeTime,
          tick.quoteVolume,
          tick.trades,
          tick.buyBaseVolume,
          tick.buyQuoteVolume,
          tick.ignore
        ]

        if (current) {
          if (tick.closeTime === current[current.length - 1][6]) {
            current[current.length - 1] = lastCandle
          } else {
            if (tick.closeTime === (current[current.length - 1][6] + 60000)) {
              current.shift()
              current.push(lastCandle)
            } else {
              void request().catch(error => { console.error(error?.message) })
            }
          }

          candlesticks(transformToOHLC(current))
        } else {
          void request().catch(error => { console.error(error?.message) })
        }
      }
    }

    this.subscribe({ streamURL: streamURL ?? this.spotStreamURL, endpoint: endpointStream, reconnectFn, callback, ID })
  }

  userDataStream ({ apiURL, streamURL, apiKey, userData }: UserDataStreamInput): void {
    const endpointRequest = 'v3/userDataStream'

    const ID = 'spot:userDataStream'

    const reconnectFn = (): void => {
      this.userDataStream({ streamURL, apiURL, apiKey, userData })
    }

    const request = async (method: 'POST' | 'PUT'): Promise<void> => {
      const response = await this.publicRequest({ apiURL: apiURL ?? this.apiURL, endpoint: endpointRequest, apiKey, method })
      if (response) this.listenKey = response.listenKey
    }

    const callback = function (data: RawData): void {
      if (Buffer.isBuffer(data)) {
        void userData(transformUserData(JSON.parse(data.toString())))
      }
    }

    request('POST')
      .then(() => {
        setTimeout(function keepAlive () {
          void request('PUT')
            .then(() => { setTimeout(keepAlive, 60 * 30 * 1000) })
            .catch(() => { setTimeout(keepAlive, 60000) })
        }, 60 * 30 * 1000)
      })
      .then(() => { if (this.listenKey) this.subscribe({ streamURL: streamURL ?? this.spotStreamURL, endpoint: this.listenKey, reconnectFn, callback, ID }) })
      .catch(error => { console.error(error.message) })
  }
}

export function binanceStreamFactory (user_id: string): BinanceStreamInterface {
  return _BinanceStream.getInstance(user_id)
}
