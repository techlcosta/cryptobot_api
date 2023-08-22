
import { type OrderSide, type OrderType } from '@/client/binance-api/interfaces/dtos'
import { type BinanceRestInterface } from '@/client/binance-api/rest/binanceRest-interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type OrdersRepositoryInterface } from '@/repositories/interfaces/orders-repository'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Orders } from '@prisma/client'

interface NewSpotOrderUseCaseRequest {
  user_id: string
  type: OrderType
  symbol: string
  side: OrderSide
  quantity: string
  price?: string
  stopPrice?: string
}

interface NewSpotOrderUseResponse {
  order: Orders
}

export class NewSpotOrderUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly ordersRepository: OrdersRepositoryInterface,
    private readonly binanceSpotApi: BinanceRestInterface,
    private readonly cryptography: CryptographyInterface
  ) {}

  async execute ({ user_id, ...rest }: NewSpotOrderUseCaseRequest): Promise<NewSpotOrderUseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!settings) throw new ResourceNotFoundError()

    const secretKey = this.cryptography.decrypt(settings.secretKey)

    const response = await this.binanceSpotApi.order({
      apiURL: settings.apiURL,
      apiKey: settings.apiKey,
      secretKey,
      ...rest
    })

    const order = await this.ordersRepository.create({
      user_id,
      client_order_id: response.clientOrderId,
      order_id: response.orderId,
      quantity: response.origQty,
      side: response.side,
      status: response.status,
      symbol: response.symbol,
      transaction_time: response.transactTime.toString(),
      type: response.type,
      limit_price: response.price,
      stop_price: response?.stopPrice,
      iceberg_quantity: response?.icebergQty
    })

    return {
      order
    }
  }
}
