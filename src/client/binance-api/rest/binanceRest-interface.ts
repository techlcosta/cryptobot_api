import { type OrderSide, type OrderType } from '../interfaces/dtos'
import { type Account } from '../interfaces/spotAccount-interface'
import { type ExchangeInfo } from '../interfaces/spotExchangeInfo-interface'
import { type MyTradesResponse } from '../interfaces/spotMyTrades-interface'
import { type DELETE_OrderResponse, type GET_OrderResponse, type PUT_OrderResponse } from '../interfaces/spotOrder-interface'

export interface ExchangeInfoInput {
  apiURL?: string
  symbol?: string
}

export interface AccountInput {
  apiURL?: string
  apiKey: string
  secretKey: string
}

export interface OrderInput {
  apiURL?: string
  apiKey: string
  secretKey: string
  type: OrderType
  symbol: string
  side: OrderSide
  quantity: string
  price?: string
  stopPrice?: string
}

export interface OrderCancelInput {
  apiURL?: string
  apiKey: string
  secretKey: string
  symbol: string
  orderId: number
}

export interface OrdersStatusInput {
  apiURL?: string
  apiKey: string
  secretKey: string
  symbol: string
  orderId: number
}

export interface MyTradesInput {
  apiURL?: string
  apiKey: string
  secretKey: string
  symbol: string
  orderId?: number
}

export interface BinanceRestInterface {
  exchangeInfo: (data: ExchangeInfoInput) => Promise<ExchangeInfo>
  account: (data: AccountInput) => Promise<Account>
  order: (data: OrderInput) => Promise<PUT_OrderResponse>
  orderCancel: (data: OrderCancelInput) => Promise<DELETE_OrderResponse>
  orderStatus: (data: OrdersStatusInput) => Promise<GET_OrderResponse>
  myTrades: (data: MyTradesInput) => Promise<MyTradesResponse[]>
}
