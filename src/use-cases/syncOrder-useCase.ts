import { type BinanceRestInterface } from '@/client/binance-api/rest/binanceRest-interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type OrdersRepositoryInterface } from '@/repositories/interfaces/orders-repository'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Orders } from '@prisma/client'

interface SyncOrderUseCaseRequest {
  user_id: string
  id: string
}

interface SyncOrderUseCaseResponse {
  order: Orders
}

export class SyncOrderUseCase {
  constructor (
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly binanceSpotRest: BinanceRestInterface,
    private readonly cryptography: CryptographyInterface
  ) {}

  async execute ({ user_id, id }: SyncOrderUseCaseRequest): Promise<SyncOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!order || !settings) throw new ResourceNotFoundError()
    if (order.user_id !== settings.user_id) throw new ResourceNotFoundError()

    const secretKey = this.cryptography.decrypt(settings.secretKey)

    const orderStatus = await this.binanceSpotRest.orderStatus({
      apiURL: settings.apiURL,
      apiKey: settings.apiKey,
      secretKey,
      symbol: order.symbol,
      orderId: order.order_id
    })

    if (orderStatus.status !== 'FILLED') {
      const updatedOrder = await this.ordersRepository.update({
        id,
        status: orderStatus.status,
        transaction_time: String(orderStatus.updateTime),
        limit_price: orderStatus.price,
        stop_price: orderStatus.stopPrice,
        iceberg_quantity: orderStatus.icebergQty
      })

      return {
        order: updatedOrder
      }
    }

    const myTrades = await this.binanceSpotRest.myTrades({
      apiURL: settings.apiURL,
      apiKey: settings.apiKey,
      secretKey,
      symbol: order.symbol,
      orderId: order.order_id
    })

    const orderTrade = myTrades.find((item) => item.orderId === order.order_id)

    const quoteAmount = parseFloat(orderStatus.cummulativeQuoteQty)
    const average_price = String(quoteAmount / parseFloat(orderStatus.executedQty))
    const isQuoteComission = orderTrade?.commissionAsset && order.symbol.endsWith(orderTrade.commissionAsset)
    const net = isQuoteComission ? String(quoteAmount - parseFloat(orderTrade.commission)) : String(quoteAmount)

    const updatedOrder = await this.ordersRepository.update({
      id,
      average_price,
      net,
      commission: orderTrade?.commission,
      status: orderStatus.status,
      transaction_time: String(orderStatus.updateTime),
      is_maker: orderTrade?.isMaker,
      limit_price: orderStatus.price,
      stop_price: orderStatus.stopPrice,
      iceberg_quantity: orderStatus.icebergQty
    })

    return {
      order: updatedOrder
    }
  }
}
