export interface Balances {
  asset: string
  free: string
  locked: string
}

export interface CommissionRates {
  maker: string
  taker: string
  buyer: string
  seller: string
}

export interface Account {
  makerCommission: number
  takerCommission: number
  buyerCommission: number
  sellerCommission: number
  commissionRates: CommissionRates
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  brokered: boolean
  requireSelfTradePrevention: boolean
  updateTime: number
  accountType: 'SPOT'
  balances: Balances[]
  permissions: ['SPOT']
}
