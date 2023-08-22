export type OrderSide = 'BUY' | 'SELL'
export type ExchangeFilterType = 'EXCHANGE_MAX_NUM_ORDERS' | 'EXCHANGE_MAX_ALGO_ORDERS'
export type OrderTypes = 'LIMIT' | 'LIMIT_MAKER' | 'MARKET' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT'
export type Permissions = 'SPOT' | 'MARGIN' | 'LEVERAGED' | 'TRD_GRP_002' | 'TRD_GRP_003' | 'TRD_GRP_004' | 'TRD_GRP_005' | 'TRD_GRP_006' | 'TRD_GRP_007'
export type AllowedSelfTradePreventionModes = 'NONE' | 'EXPIRE_TAKER' | 'EXPIRE_MAKER' | 'EXPIRE_BOTH'
export type SymbolFilterType = | 'PRICE_FILTER' | 'LOT_SIZE' | 'MIN_NOTIONAL' | 'ICEBERG_PARTS' | 'MARKET_LOT_SIZE' | 'TRAILING_DELTA' | 'PERCENT_PRICE_BY_SIDE' | 'MAX_NUM_ORDERS' | 'MAX_NUM_ALGO_ORDERS'
export type OrderType = 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT' | 'LIMIT_MAKER' | 'OCO'
export type EventType = 'listStatus' | 'executionReport' | 'balanceUpdate' | 'outboundAccountPosition'
export type MarginType = 'ISOLATED' | 'CROSSED'
export type PositionSide = 'BOTH' | 'SHORT' | 'LONG'
export type TimeInForce = 'GTC' | 'IOC' | 'FOK'
export type ListOrderStatus = 'EXECUTING' | 'ALL_DONE' | 'REJECT'
export type ListStatusType = 'RESPONSE' | 'EXEC_STARTED' | 'ALL_DONE'
export type ExecutionType = 'NEW' | 'CANCELED' | 'REPLACED' | 'REJECTED' | 'TRADE' | 'EXPIRED'
export type OrderStatus = 'CANCELED' | 'EXPIRED' | 'FILLED' | 'NEW' | 'PARTIALLY_FILLED' | 'PENDING_CANCEL' | 'REJECTED'
export type OrderRejectReason =
| 'ACCOUNT_CANNOT_SETTLE'
| 'ACCOUNT_INACTIVE'
| 'DUPLICATE_ORDER'
| 'INSUFFICIENT_BALANCE'
| 'MARKET_CLOSED'
| 'NONE'
| 'ORDER_WOULD_TRIGGER_IMMEDIATELY'
| 'PRICE_QTY_EXCEED_HARD_LIMITS'
| 'UNKNOWN_ACCOUNT'
| 'UNKNOWN_INSTRUMENT'
| 'UNKNOWN_ORDER'

export enum OrderTypeEnum {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP_LOSS = 'STOP_LOSS',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER',
  OCO = 'OCO'
}

export enum SymbolFilterEnum {
  PRICE_FILTER = 'PRICE_FILTER',
  LOT_SIZE = 'LOT_SIZE',
  MIN_NOTIONAL = 'MIN_NOTIONAL',
  ICEBERG_PARTS = 'ICEBERG_PARTS',
  MARKET_LOT_SIZE = 'MARKET_LOT_SIZE',
  TRAILING_DELTA = 'TRAILING_DELTA',
  PERCENT_PRICE_BY_SIDE = 'PERCENT_PRICE_BY_SIDE',
  MAX_NUM_ORDERS = 'MAX_NUM_ORDERS',
  MAX_NUM_ALGO_ORDERS = 'MAX_NUM_ALGO_ORDERS',
}
