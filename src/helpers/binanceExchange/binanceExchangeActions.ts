import { IndicatorsAdapter } from '@/adapters/indicators/indicators-adapter'
import { type OHLC } from '@/client/binance-api/interfaces/candlesticks-interface'
import { type MiniTicker } from '@/client/binance-api/interfaces/miniTicker-interface'
import { type Ticker } from '@/client/binance-api/interfaces/ticker-interface'
import { type ExecutionReport, type UserDataStreamEvent } from '@/client/binance-api/interfaces/userData-interface'
import { binanceStreamFactory } from '@/client/binance-api/stream/binanceStream'
import { type CacheRepositoryInterface } from '@/repositories/interfaces/cache-repository'
import { type OrdersRepositoryInterface, type PrismaOrdersUpdateInput } from '@/repositories/interfaces/orders-repository'
import { PrismaOrdersRepository } from '@/repositories/prisma/orders-repository'
import { RedisCacheRepository } from '@/repositories/redis/cache-repository'
import { getWalletBalancesUseCaseFactory } from '@/use-cases/factories/factory-getWalletBalances-useCase'
import { type GetWalletBalancesUseCase } from '@/use-cases/getWalletBalances-useCase'
import { type IndicatorsAdapterInterface } from '../../adapters/indicators/indicators-adapter-interface'
import { type BinanceExchangeActionsInterface, type StartSpotCandlestickInput, type StartSpotUserDataInput } from './binanceExchangeActions-interface'

class _BinanceExchangeActions implements BinanceExchangeActionsInterface {
  private readonly system_id = 'SYSTEM'

  constructor (
    private readonly indicatorsAdapter: IndicatorsAdapterInterface,
    private readonly cacheRepository: CacheRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly getWalletBalances: GetWalletBalancesUseCase
  ) {}

  async startSpotTicker (): Promise<void> {
    const binanceStream = binanceStreamFactory(this.system_id)

    const tickers = (data: Ticker[]): void => {
      data.forEach(ticker => {
        const converted = {
          lastPrice: parseFloat(ticker.lastPrice),
          open: parseFloat(ticker.open),
          high: parseFloat(ticker.high),
          low: parseFloat(ticker.high),
          bestBid: parseFloat(ticker.bestBid),
          bestAsk: parseFloat(ticker.bestAsk)
        }

        void this.cacheRepository.updateWithExpiresTime({
          user_id: this.system_id,
          symbol: ticker.symbol,
          index: 'TICKER',
          value: JSON.stringify(converted),
          expiresIn: 60
        })
      })
    }

    binanceStream.tickerStream({ tickers })
  }

  async startSpotMiniTicker (): Promise<void> {
    const binanceStream = binanceStreamFactory(this.system_id)

    const miniTickers = (data: MiniTicker[]): void => {
      data.forEach(miniTicker => {
        void this.cacheRepository.updateWithExpiresTime({
          user_id: this.system_id,
          symbol: miniTicker.symbol,
          index: 'MINI_TICKER',
          value: JSON.stringify(miniTicker),
          expiresIn: 60
        })
      })
    }

    binanceStream.miniTickerStream({ miniTickers })
  }

  async startSpotCandlestick ({ apiURL, streamURL, user_id, symbol, interval, indexes }: StartSpotCandlestickInput): Promise<void> {
    const binanceStream = binanceStreamFactory(user_id)

    const candlesticks = (ohlc: OHLC): void => {
      indexes.forEach(({ type, params }) => {
        const index = `${type}_${params}`

        switch (type) {
          case 'RSI':
            void this.indicatorsAdapter.rsi({ params, values: ohlc.close })
              .then(async (rsi) => {
                await this.cacheRepository.updateWithExpiresTime({
                  user_id,
                  index,
                  symbol,
                  interval,
                  value: JSON.stringify(rsi),
                  expiresIn: 60,
                  notify: (key) => { console.log(key) }
                })
              })
              .catch((error) => { console.error(error.message) })
            break
          case 'EMA':
            void this.indicatorsAdapter.ema({ params, values: ohlc.close })
              .then(async (ema) => {
                await this.cacheRepository.updateWithExpiresTime({ user_id, index, symbol, interval, value: JSON.stringify(ema), expiresIn: 60 })
              })
              .catch((error) => { console.error(error.message) })
            break
          case 'SMA':
            void this.indicatorsAdapter.sma({ params, values: ohlc.close })
              .then(async (sma) => {
                await this.cacheRepository.updateWithExpiresTime({ user_id, index, symbol, interval, value: JSON.stringify(sma), expiresIn: 60 })
              })
              .catch((error) => { console.error(error.message) })
            break
          default:
            console.error(`${type} type not found.`)
            break
        }
      })
    }

    binanceStream.candlestickStream({ apiURL, streamURL, symbol, interval, candlesticks })
  }

  async startSpotUserData ({ user_id, apiURL, streamURL, apiKey }: StartSpotUserDataInput): Promise<void> {
    const binanceStream = binanceStreamFactory(user_id)

    await this.outboundAccountPosition(user_id).catch(err => { console.error(err.message) })

    const userData = async (data: UserDataStreamEvent | null): Promise<void> => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          if (data?.eventType === 'executionReport') this.executionReport(user_id, data as ExecutionReport).finally(resolve)
          if (data?.eventType === 'outboundAccountPosition') this.outboundAccountPosition(user_id).finally(resolve)
        }, 1000)
      })
    }

    binanceStream.userDataStream({ apiURL, streamURL, apiKey, userData })
  }

  private async outboundAccountPosition (user_id: string): Promise<void> {
    const { balances } = await this.getWalletBalances.execute({ user_id })

    for (const balance of balances) {
      const converted = {
        free: parseFloat(balance.free),
        locked: parseFloat(balance.locked)
      }
      await this.cacheRepository.update({
        user_id,
        symbol: balance.asset,
        index: 'WALLET',
        value: JSON.stringify(converted)
      })
    }
  }

  private async executionReport (user_id: string, data: ExecutionReport): Promise<void> {
    if (data.executionType === 'NEW') return

    const client_order_id = (data.orderStatus === 'CANCELED' ? data.originalClientOrderId : data.clientOrderId) as string

    const order = await this.ordersRepository.findByuserIdAndOrderIdAndClientOrderId({ user_id, order_id: data.orderId, client_order_id })

    if (!order) return

    const updatedValues: PrismaOrdersUpdateInput = {
      id: order.id,
      is_maker: data.isBuyerMaker,
      limit_price: data?.price,
      stop_price: data?.stopPrice,
      iceberg_quantity: data?.icebergQuantity,
      transaction_time: String(data?.transactionTime)
    }

    if (data.orderStatus !== 'FILLED') {
      if (data.orderStatus !== order.status) updatedValues.status = data.orderStatus
      if (data.orderStatus === 'REJECTED') updatedValues.obs = data.orderRejectReason

      await this.ordersRepository.update(updatedValues)
    } else {
      const quoteAmount = parseFloat(data.totalQuoteTradeQuantity)
      updatedValues.average_price = String(quoteAmount / parseFloat(data.totalTradeQuantity))
      updatedValues.commission = data.commission
      const isQuoteComission = data.commissionAsset && data.symbol.endsWith(data.commissionAsset)
      updatedValues.net = isQuoteComission ? String(quoteAmount - parseFloat(data.commission)) : String(quoteAmount)
      updatedValues.status = data.orderStatus

      await this.ordersRepository.update(updatedValues)
    }
  }
}

export class BinanceExchangeActions extends _BinanceExchangeActions {
  constructor () {
    super(
      new IndicatorsAdapter(),
      new RedisCacheRepository(),
      new PrismaOrdersRepository(),
      getWalletBalancesUseCaseFactory()
    )
  }
}
