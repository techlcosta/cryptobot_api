import { type EventType, type ExecutionType, type ListOrderStatus, type ListStatusType, type OrderRejectReason, type OrderSide, type OrderStatus, type OrderType, type TimeInForce } from './dtos'

export type Balances = Record<string, {
  available: string
  locked: string
}>

export interface ListStatusResponse {
  e: EventType // Event Type
  E: number // Event Time
  s: string // Symbol
  g: number // OrderListId
  c: 'OCO' | string // Contingency Type
  l: ListStatusType // List Status Type
  L: ListOrderStatus // List Order Status
  r: 'NONE' | string // List Reject Reason
  C: string // List Client Order ID
  T: number // Transaction Time
  O: [ // An array of objects
    {
      s: string // Symbol
      i: number // orderId
      c: string // ClientOrderId
    }
  ]
}

export interface ListStatus {
  eventType: EventType // Event Type
  eventTime: number // Event Time
  symbol: string // Symbol
  orderListId: number // OrderListId
  contingencyType: 'OCO' | string // Contingency Type
  listStatusType: ListStatusType // List Status Type
  listOrderStatus: ListOrderStatus // List Order Status
  listRejectReason: 'NONE' | string // List Reject Reason
  listClientOrderId: string // List Client Order ID
  transactionTime: number // Transaction Time
  orders: Array<{
    symbol: string // Symbol
    orderId: number // orderId
    clientOrderId: string // ClientOrderId
  }>
}

export interface ExecutionReportResponse {
  e: EventType // Event type
  E: number // Event time
  s: string // Symbol
  c: string // Client order ID
  S: OrderSide // Side
  o: OrderType // Order type
  f: TimeInForce // Time in force
  q: string // Order quantity
  p: string // Order price
  P: string // Stop price
  F: string // Iceberg quantity
  g: number // OrderListId
  C: string // Original client order ID; This is the ID of the order being canceled
  x: ExecutionType // Current execution type
  X: OrderStatus // Current order status
  r: OrderRejectReason // Order reject reason; will be an error code.
  i: number // Order ID
  l: string // Last executed quantity
  z: string // Cumulative filled quantity
  L: string // Last executed price
  n: string // Commission amount
  N: string | null // Commission asset
  T: number // Transaction time
  t: number // Trade ID
  I: number // Ignore
  w: boolean // Is the order on the book?
  m: boolean // Is this trade the maker side?
  M: boolean // Ignore
  O: number // Order creation time
  Z: string // Cumulative quote asset transacted quantity
  Y: string // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  Q: string // Quote Order Quantity
  W: number // Working Time; This is only visible if the order has been placed on the book.
  V: string // selfTradePreventionMode
}

export interface ExecutionReport {
  eventType: EventType
  eventTime: number
  symbol: string // Symbol
  clientOrderId: string // Client order ID
  side: OrderSide // Side
  orderType: OrderType // Order type
  timeInForce: TimeInForce // Time in force
  quantity: string // Order quantity
  price: string // Order price
  stopPrice: string // Stop price
  icebergQuantity: string // Iceberg quantity
  orderListId: number // OrderListId
  originalClientOrderId: string | null // Original client order ID; This is the ID of the order being canceled
  executionType: ExecutionType // Current execution type
  orderStatus: OrderStatus // Current order status
  orderRejectReason: OrderRejectReason // Order reject reason; will be an error code.
  orderId: number // Order ID
  lastTradeQuantity: string // Last executed quantity
  totalTradeQuantity: string // Cumulative filled quantity
  priceLastTrade: string // Last executed price
  commission: string // Commission amount
  commissionAsset: string | null // Commission asset
  transactionTime: number // Transaction time
  tradeId: number // Trade ID
  isOrderWorking: boolean // Is the order on the book?
  isBuyerMaker: boolean // Is this trade the maker side?
  creationTime: number // Order creation time
  totalQuoteTradeQuantity: string // Cumulative quote asset transacted quantity
  lastQuoteTransacted: string // Last quote asset transacted quantity (i.e. lastPrice * lastQty);
  quoteOrderQuantity: string // Quote Order Quantity
  workingTime: number // Working Time; This is only visible if the order has been placed on the book.
  selfTradePreventionMode: string // selfTradePreventionMode
}

export interface BalanceUpdateResponse {
  e: EventType // Event Type
  E: number // Event Time
  a: string // Asset
  d: string // Balance Delta
  T: number // Clear Time
}

export interface BalanceUpdate {
  eventType: EventType // Event Type
  eventTime: number // Event Time
  asset: string // Asset
  balanceDelta: string // Balance Delta
  clearTime: number // Clear Time
}

export interface OutboundAccountPositionResponse {
  e: EventType // Event type
  E: number // Event Time
  u: number // Time of last account update
  B: [ // Balances Array
    {
      a: string // Asset
      f: string // Free
      l: string // Locked
    }
  ]
}

export interface AssetBalance {
  asset: string // Asset
  free: string // Free
  locked: string // Locked
}

export interface OutboundAccountPosition {
  eventType: EventType // Event type
  eventTime: number // Event Time
  lastAccountUpdate: number // Time of last account update
  balances: AssetBalance[] // Balances Array
}

export type UserDataStreamEvent =
| ListStatus
| ExecutionReport
| BalanceUpdate
| OutboundAccountPosition
