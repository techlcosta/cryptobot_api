import { type BinanceRestInterface } from '@/client/binance-api/rest/binanceRest-interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type OrdersRepositoryInterface } from '@/repositories/interfaces/orders-repository'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Orders } from '@prisma/client'

interface CancelOrderUseCaseRequest {
  user_id: string
  id: string
}

interface CancelOrderUseCaseResponse {
  order: Orders
}

export class CancelOrderUseCase {
  constructor (
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly binanceSpotRest: BinanceRestInterface,
    private readonly cryptography: CryptographyInterface
  ) {

  }

  async execute ({ user_id, id }: CancelOrderUseCaseRequest): Promise<CancelOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!order || !settings) throw new ResourceNotFoundError()

    if (order.user_id !== settings.user_id) throw new ResourceNotFoundError()

    const secretKey = this.cryptography.decrypt(settings.secretKey)

    const response = await this.binanceSpotRest.orderCancel({
      apiURL: settings.apiURL,
      apiKey: settings.apiKey,
      secretKey,
      symbol: order.symbol,
      orderId: order.order_id
    })

    const updatedOrder = await this.ordersRepository.update({
      id: order.id,
      client_order_id: response.origClientOrderId,
      quantity: response.executedQty,
      status: response.status,
      iceberg_quantity: response?.icebergQty,
      stop_price: response?.stopPrice
    })

    return {
      order: updatedOrder
    }
  }
}
