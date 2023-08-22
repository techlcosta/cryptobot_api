
export interface MyTradesResponse {
  symbol: string
  id: number
  orderId: number
  orderListId: number // Unless OCO, the value will always be -1
  price: string
  qty: string
  quoteQty: string
  commission: string
  commissionAsset: string
  time: number
  isBuyer: boolean
  isMaker: boolean
  isBestMatch: boolean
}
