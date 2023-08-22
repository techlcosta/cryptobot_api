import { type AllowedSelfTradePreventionModes, type ExchangeFilterType, type OrderTypes, type SymbolFilterType } from './dtos'

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

export interface ExchangeInfo {
  timezone: string
  serverTime: number
  rateLimits: RateLimits[]
  exchangeFilters: ExchangeFilter[]
  symbols: Symbols[]
  permissions: Permissions[]
  defaultSelfTradePreventionMode: string
  allowedSelfTradePreventionModes: AllowedSelfTradePreventionModes[]
}
