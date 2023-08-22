import { BinanceError } from '@/errors/binance-error'
import { OrderTypeEnum } from '../interfaces/dtos'
import { type Account } from '../interfaces/spotAccount-interface'
import { type ExchangeInfo } from '../interfaces/spotExchangeInfo-interface'
import { type MyTradesResponse } from '../interfaces/spotMyTrades-interface'
import { type DELETE_OrderResponse, type GET_OrderResponse, type PUT_OrderResponse } from '../interfaces/spotOrder-interface'
import { HttpConnection } from '../utils/http-connection'
import { type AccountInput, type BinanceRestInterface, type ExchangeInfoInput, type MyTradesInput, type OrderCancelInput, type OrderInput, type OrdersStatusInput } from './binanceRest-interface'

type QueryType = Record<string, string | number>

export class BinanceRest extends HttpConnection implements BinanceRestInterface {
  private readonly spotApiURL = 'https://api.binance.com/api/'

  async exchangeInfo ({ apiURL, symbol }: ExchangeInfoInput): Promise<ExchangeInfo> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = symbol === undefined ? 'v3/exchangeInfo' : `v3/exchangeInfo?symbol=${symbol}`

    const response = await this.publicRequest({ apiURL: URL, endpoint })

    return response
  }

  async account ({ apiURL, apiKey, secretKey }: AccountInput): Promise<Account> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = 'v3/account'

    const method = 'GET'

    const queryData: QueryType = {
      timestamp: Date.now()
    }

    const response = await this.privateRequest({ apiURL: URL, endpoint, apiKey, secretKey, queryData, method })

    return response
  }

  async order ({ apiURL, apiKey, secretKey, type, quantity, side, symbol, price, stopPrice }: OrderInput): Promise<PUT_OrderResponse> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = type === OrderTypeEnum.OCO ? 'v3/order/oco' : 'v3/order'

    const timestamp = Date.now()

    const timeInForce = 'GTC'

    const method = 'POST'

    const queryData: QueryType = {
      symbol,
      side,
      type,
      quantity,
      timestamp
    }

    switch (type) {
      case OrderTypeEnum.MARKET:
        break
      case OrderTypeEnum.LIMIT:
        if (!price) throw new BinanceError('LIMIT type order require price parameter')
        queryData.timeInForce = timeInForce
        queryData.price = price
        break
      case OrderTypeEnum.STOP_LOSS:
        if (!stopPrice) throw new BinanceError('STOP_LOSS type order require stopPrice parameter')
        queryData.stopPrice = stopPrice
        break
      case OrderTypeEnum.STOP_LOSS_LIMIT:
        if (!price || !stopPrice) throw new BinanceError('STOP_LOSS_LIMIT type order require price and stopPrice parameter')
        queryData.price = price
        queryData.stopPrice = stopPrice
        queryData.timeInForce = timeInForce
        break
      case OrderTypeEnum.TAKE_PROFIT:
        if (!stopPrice) throw new BinanceError('TAKE_PROFIT type order require stopPrice parameter')
        queryData.stopPrice = stopPrice
        break
      case OrderTypeEnum.TAKE_PROFIT_LIMIT:
        if (!price || !stopPrice) throw new BinanceError('TAKE_PROFIT_LIMIT type order require price and stopPrice parameter')
        queryData.price = price
        queryData.stopPrice = stopPrice
        queryData.timeInForce = timeInForce
        break
      case OrderTypeEnum.LIMIT_MAKER:
        if (!price) throw new BinanceError('LIMIT_MAKER type order require price parameter')
        queryData.timeInForce = timeInForce
        queryData.price = price
        break
      case OrderTypeEnum.OCO:
        if (!price || !stopPrice) throw new BinanceError('OCO type order require price and stopPrice parameter')
        delete queryData.type
        queryData.price = price
        queryData.stopPrice = stopPrice
        break
      default:
        throw new BinanceError('Type order not found')
    }

    const response = await this.privateRequest({ apiURL: URL, endpoint, apiKey, secretKey, queryData, method })

    return response
  }

  async orderCancel ({ apiURL, apiKey, secretKey, symbol, orderId }: OrderCancelInput): Promise<DELETE_OrderResponse> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = 'v3/order'

    const timestamp = Date.now()

    const method = 'DELETE'

    const queryData: QueryType = {
      symbol,
      orderId,
      timestamp
    }

    const response = await this.privateRequest({ apiURL: URL, endpoint, apiKey, secretKey, queryData, method })

    return response
  }

  async orderStatus ({ apiURL, apiKey, secretKey, symbol, orderId }: OrdersStatusInput): Promise<GET_OrderResponse> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = 'v3/order'

    const timestamp = Date.now()

    const method = 'GET'

    const queryData: QueryType = {
      symbol,
      orderId,
      timestamp
    }

    const response = await this.privateRequest({ apiURL: URL, endpoint, apiKey, secretKey, queryData, method })

    return response
  }

  async myTrades ({ apiURL, apiKey, secretKey, symbol, orderId }: MyTradesInput): Promise<MyTradesResponse[]> {
    const URL = apiURL ?? this.spotApiURL

    const endpoint = 'v3/myTrades'

    const timestamp = Date.now()

    const method = 'GET'

    const queryData: QueryType = {
      symbol,
      timestamp
    }

    if (orderId) queryData.orderId = orderId

    const response = await this.privateRequest({ apiURL: URL, endpoint, apiKey, secretKey, queryData, method })

    return response
  }
}
