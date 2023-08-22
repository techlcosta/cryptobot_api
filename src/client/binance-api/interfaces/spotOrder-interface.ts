import { type OrderSide, type OrderStatus, type OrderType, type TimeInForce } from './dtos'

export interface Fills {
  price: string
  qty: string
  commission: string
  commissionAsset: string
  tradeId: number
}

export interface PUT_OrderResponse {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  transactTime: number
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: OrderStatus
  timeInForce: TimeInForce
  type: OrderType
  side: OrderSide
  workingTime: number
  selfTradePreventionMode: string
  fills: Fills[]
  icebergQty?: string
  stopPrice?: string
  preventedMatchId?: string
  strategyId?: string
  strategyType?: string
  trailingDelta?: string
  preventedQuantity?: string
  trailingTime?: string
}

export interface GET_OrderResponse {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: OrderStatus
  timeInForce: TimeInForce
  type: OrderType
  side: OrderSide
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorking: boolean
  workingTime: number
  origQuoteOrderQty: string
  selfTradePreventionMode: string
}

export interface DELETE_OrderResponse {
  symbol: string
  origClientOrderId: string
  orderId: number
  orderListId: number // Unless part of an OCO, the value will always be -1.
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: OrderStatus
  timeInForce: TimeInForce
  type: OrderType
  side: OrderSide
  selfTradePreventionMode: string
  icebergQty?: string
  stopPrice?: string
  preventedMatchId?: string
  strategyId?: string
  strategyType?: string
  trailingDelta?: string
  preventedQuantity?: string
  trailingTime?: string
}
