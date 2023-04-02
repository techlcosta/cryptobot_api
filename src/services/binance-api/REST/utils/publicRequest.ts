import { BinanceRequestError } from '@/errors/binance-request-error'
import { z } from 'zod'

interface BinanceErrors {
  code: number
  msg: string
}

const publicRequestSchema = z.object({
  baseURL: z.string().optional(),
  endpoint: z.string()
})

type publicRequestInput = z.infer<typeof publicRequestSchema>

export async function publicRequest (data: publicRequestInput): Promise<any> {
  const { baseURL, endpoint } = publicRequestSchema.parse(data)

  const URL = `${baseURL ?? 'https://api.binance.com/api/'}${endpoint}`

  const response = await fetch(URL)

  if (response.status !== 200) {
    const json: BinanceErrors = await response.json()

    throw new BinanceRequestError(`code: ${json.code}, message: ${json.msg}`)
  }

  return await response.json()
}
