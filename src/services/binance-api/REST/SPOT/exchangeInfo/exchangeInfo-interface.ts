
export type ExchangeFilterType = 'EXCHANGE_MAX_NUM_ORDERS' | 'EXCHANGE_MAX_ALGO_ORDERS'

export type OrderTypes = 'LIMIT' | 'LIMIT_MAKER' | 'MARKET' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT'

export type Permissions = 'SPOT' | 'MARGIN' | 'LEVERAGED' | 'TRD_GRP_002' | 'TRD_GRP_003' | 'TRD_GRP_004' | 'TRD_GRP_005' | 'TRD_GRP_006' | 'TRD_GRP_007'

export type AllowedSelfTradePreventionModes = 'NONE' | 'EXPIRE_TAKER' | 'EXPIRE_MAKER' | 'EXPIRE_BOTH'

export type SymbolFilterType = | 'PRICE_FILTER' | 'LOT_SIZE' | 'MIN_NOTIONAL' | 'ICEBERG_PARTS' | 'MARKET_LOT_SIZE' | 'TRAILING_DELTA' | 'PERCENT_PRICE_BY_SIDE' | 'MAX_NUM_ORDERS' | 'MAX_NUM_ALGO_ORDERS'

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

export interface RateLimits {
  rateLimitType: string
  interval: string
  intervalNum: number
  limit: number
}

export interface ExchangeFilter {
  filterType: ExchangeFilterType
  limit: number
}

export interface SymbolPriceFilter {
  filterType: SymbolFilterType
  minPrice: string
  maxPrice: string
  tickSize: string
}

export interface SymbolLotSizeFilter {
  filterType: SymbolFilterType
  minQty: string
  maxQty: string
  stepSize: string
}

export interface SymbolMinNotionalFilter {
  filterType: SymbolFilterType
  minNotional: string
  applyToMarket: boolean
  avgPriceMins: number
}

export interface SymbolIcergPartsFilter {
  filterType: SymbolFilterType
  limit: number
}

export interface SymbolMarketLotSizeFilter {
  filterType: SymbolFilterType
  minQty: string
  maxQty: string
  stepSize: string
}

export interface SymbolTrailingDeltaFilter {
  filterType: SymbolFilterType
  minTrailingAboveDelta: number
  maxTrailingAboveDelta: number
  minTrailingBelowDelta: number
  maxTrailingBelowDelta: number
}

export interface SymbolPercentPriceBySideFilter {
  filterType: SymbolFilterType
  bidMultiplierUp: string
  bidMultiplierDown: string
  askMultiplierUp: string
  askMultiplierDown: string
  avgPriceMins: number
}

export interface SymbolMaxNumOrdersFilter {
  filterType: SymbolFilterType
  maxNumOrders: number
}

export interface SymbolNumMaxAlgoOrdersFilter {
  filterType: SymbolFilterType
  maxNumAlgoOrders: number
}

type SymbolFilter =
| SymbolPriceFilter
| SymbolLotSizeFilter
| SymbolMinNotionalFilter
| SymbolIcergPartsFilter
| SymbolMarketLotSizeFilter
| SymbolTrailingDeltaFilter
| SymbolPercentPriceBySideFilter
| SymbolMaxNumOrdersFilter
| SymbolNumMaxAlgoOrdersFilter

export interface Symbols {
  symbol: string
  status: string
  baseAsset: string
  baseAssetPrecision: number
  quoteAsset: string
  quotePrecision: number
  quoteAssetPrecision: number
  baseCommissionPrecision: number
  quoteCommissionPrecision: number
  orderTypes: OrderTypes[]
  icebergAllowed: boolean
  ocoAllowed: boolean
  quoteOrderQtyMarketAllowed: boolean
  allowTrailingStop: boolean
  cancelReplaceAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: SymbolFilter[]
}

export interface ExchangeInfoInput {
  baseURL?: string
  symbol?: string
}

export interface ExchangeInfoOut {
  timezone: string
  serverTime: number
  rateLimits: RateLimits[]
  exchangeFilters: ExchangeFilter[]
  symbols: Symbols[]
  permissions: Permissions[]
  defaultSelfTradePreventionMode: string
  allowedSelfTradePreventionModes: AllowedSelfTradePreventionModes[]
}

export type ExchangeInfoInterface = (data: ExchangeInfoInput) => Promise<ExchangeInfoOut>
