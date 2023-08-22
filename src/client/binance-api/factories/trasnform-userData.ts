import { type BalanceUpdateResponse, type ExecutionReport, type ExecutionReportResponse, type ListStatusResponse, type OutboundAccountPosition, type OutboundAccountPositionResponse, type UserDataStreamEvent } from '../interfaces/userData-interface'

type userDataResponse =
| ListStatusResponse
| ExecutionReportResponse
| BalanceUpdateResponse
| OutboundAccountPositionResponse

export function transformUserData (data: userDataResponse): UserDataStreamEvent | null {
  switch (data.e) {
    case 'executionReport':
      return transformExecutionReport(data as ExecutionReportResponse)
    case 'outboundAccountPosition':
      return transformOutboundAccountPosition(data as OutboundAccountPositionResponse)
    default:
      return null
  }
}

function transformOutboundAccountPosition (data: OutboundAccountPositionResponse): OutboundAccountPosition {
  const balances = data.B.map(balance => {
    return { asset: balance.a, free: balance.f, locked: balance.l }
  })
  return {
    eventType: data.e,
    eventTime: data.E,
    lastAccountUpdate: data.u,
    balances
  }
}

function transformExecutionReport (data: ExecutionReportResponse): ExecutionReport {
  return {
    eventType: data.e,
    eventTime: data.E,
    symbol: data.s,
    clientOrderId: data.c,
    side: data.S,
    orderType: data.o,
    timeInForce: data.f,
    quantity: data.q,
    price: data.p,
    stopPrice: data.P,
    icebergQuantity: data.F,
    orderListId: data.g,
    originalClientOrderId: data.C,
    executionType: data.x,
    orderStatus: data.X,
    orderRejectReason: data.r,
    orderId: data.i,
    lastTradeQuantity: data.l,
    totalTradeQuantity: data.z,
    priceLastTrade: data.L,
    commission: data.n,
    commissionAsset: data.N,
    transactionTime: data.T,
    tradeId: data.t,
    isOrderWorking: data.w,
    isBuyerMaker: data.m,
    creationTime: data.O,
    totalQuoteTradeQuantity: data.Z,
    lastQuoteTransacted: data.Y,
    quoteOrderQuantity: data.Q,
    workingTime: data.W,
    selfTradePreventionMode: data.V
  }
}
