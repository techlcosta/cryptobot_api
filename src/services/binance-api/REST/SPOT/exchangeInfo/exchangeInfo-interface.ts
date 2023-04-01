
type ExchangeFilterType = 'EXCHANGE_MAX_NUM_ORDERS' | 'EXCHANGE_MAX_ALGO_ORDERS'

type OrderTypes = 'LIMIT' | 'LIMIT_MAKER' | 'MARKET' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT_LIMIT'

type Permissions = 'SPOT' | 'MARGIN' | 'LEVERAGED' | 'TRD_GRP_002' | 'TRD_GRP_003' | 'TRD_GRP_004' | 'TRD_GRP_005' | 'TRD_GRP_006' | 'TRD_GRP_007'

type AllowedSelfTradePreventionModes = 'NONE' | 'EXPIRE_TAKER' | 'EXPIRE_MAKER' | 'EXPIRE_BOTH'

enum SymbolFilterEnum {
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

interface RateLimits {
  rateLimitType: string
  interval: string
  intervalNum: number
  limit: number
}

interface ExchangeFilter {
  filterType: ExchangeFilterType
  limit: number
}

interface SymbolPriceFilter {
  filterType: SymbolFilterEnum.PRICE_FILTER
  minPrice: string
  maxPrice: string
  tickSize: string
}

interface SymbolLotSizeFilter {
  filterType: SymbolFilterEnum.LOT_SIZE
  minQty: string
  maxQty: string
  stepSize: string
}

interface SymbolMinNotionalFilter {
  filterType: SymbolFilterEnum.MIN_NOTIONAL
  minNotional: string
  applyToMarket: boolean
  avgPriceMins: number
}

interface SymbolIcergPartsFilter {
  filterType: SymbolFilterEnum.ICEBERG_PARTS
  limit: number
}

interface SymbolMarketLotSizeFilter {
  filterType: SymbolFilterEnum.MARKET_LOT_SIZE
  minQty: string
  maxQty: string
  stepSize: string
}

interface SymbolTrailingDeltaFilter {
  filterType: string
  minTrailingAboveDelta: number
  maxTrailingAboveDelta: number
  minTrailingBelowDelta: number
  maxTrailingBelowDelta: number
}

interface SymbolPercentPriceBySideFilter {
  filterType: SymbolFilterEnum.PERCENT_PRICE_BY_SIDE
  bidMultiplierUp: string
  bidMultiplierDown: string
  askMultiplierUp: string
  askMultiplierDown: string
  avgPriceMins: number
}

interface SymbolMaxNumOrdersFilter {
  filterType: SymbolFilterEnum.MAX_NUM_ORDERS
  maxNumOrders: number
}

interface SymbolNumMaxAlgoOrdersFilter {
  filterType: SymbolFilterEnum.MAX_NUM_ALGO_ORDERS
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

interface Symbols {
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
