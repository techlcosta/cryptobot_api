
import { BinanceError } from '@/errors/binance-error'
import { createHmac } from 'crypto'
import { z } from 'zod'

type QueryData = Record<string, string | number>

interface PublicRequestInput {
  apiURL: string
  endpoint: string
  apiKey?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

interface PrivateRequestInput extends PublicRequestInput {
  apiKey: string
  secretKey: string
  queryData: QueryData
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export class HttpConnection {
  private readonly makeQuery = function (data: QueryData): string {
    return Object.entries(data).map(([key, value]) => {
      return `${key}=${value}`
    }).join('&')
  }

  protected async publicRequest ({ apiURL, endpoint, apiKey, method }: PublicRequestInput): Promise<any> {
    const URL = `${apiURL}${endpoint}`

    const headers = apiKey ? { 'X-MBX-APIKEY': apiKey } : undefined

    try {
      const response = await fetch(URL, { method, headers })

      const json = await response.json()

      if (response.status !== 200) {
        const binanceErrorsSchema = z.object({
          code: z.number().or(z.string()),
          msg: z.string()
        })

        const resp = binanceErrorsSchema.safeParse(json)

        if (resp.success) throw new BinanceError(`code: ${resp.data.code}, message: ${resp.data.msg}`)
        else throw new BinanceError('unexpected error')
      }

      return json
    } catch (error: any) {
      throw new BinanceError(error?.message ?? 'unexpected error')
    }
  }

  protected async privateRequest ({ apiURL, endpoint, apiKey, secretKey, queryData, method }: PrivateRequestInput): Promise<any> {
    if (apiURL && !apiURL.endsWith('/')) apiURL = `${apiURL}/`

    const query = this.makeQuery(queryData)

    const signature = createHmac('sha256', secretKey).update(query).digest('hex')

    const URL = `${apiURL}${endpoint}?${query}&signature=${signature}`

    const response = await fetch(URL, {
      method,
      headers: {
        'X-MBX-APIKEY': apiKey
      }
    })

    const json = await response.json()

    if (response.status !== 200) {
      const binanceErrorsSchema = z.object({
        code: z.number().or(z.string()),
        msg: z.string()
      })

      const resp = binanceErrorsSchema.safeParse(json)

      if (resp.success) throw new BinanceError(`code: ${resp.data.code}, message: ${resp.data.msg}`)
      else throw new BinanceError('unexpected error')
    }

    return json
  }
}
