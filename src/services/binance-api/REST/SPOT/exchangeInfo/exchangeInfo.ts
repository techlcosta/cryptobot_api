import { z } from 'zod'
import { publicRequest } from '../../utils/publicRequest'
import { type ExchangeInfoInput, type ExchangeInfoInterface, type ExchangeInfoOut } from './exchangeInfo-interface'

export const exchangeInfo: ExchangeInfoInterface = async function (data: ExchangeInfoInput): Promise<ExchangeInfoOut> {
  const exchangeInfoSchema = z.object({
    baseURL: z.string().optional(),
    symbol: z.string().optional()
  })

  const { baseURL, symbol } = exchangeInfoSchema.parse(data)

  const endpoint = symbol === undefined ? 'v3/exchangeInfo' : `v3/exchangeInfo?symbol=${symbol}`

  const response = await publicRequest({
    baseURL,
    endpoint
  })

  return response
}
