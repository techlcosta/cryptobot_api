
export type IndexTypes = 'CHART' | 'RSI' | 'EMA' | 'SMA' | 'MINI_TICKER' | 'TICKER' | 'WALLET'

export interface UpdateCacheInput {
  user_id: string
  symbol: string
  index: string
  interval?: string
  value: string
  notify?: (key: string) => void
}

export interface UpdateWithExpiresTimeInput extends UpdateCacheInput {
  expiresIn: number
}

export interface SubscribeInput {
  chanel: string
}

export interface ListenerInput {
  chanel: string
  callback: (data: Record<string, object>) => Promise<void>
}

export interface CacheRepositoryInterface {
  update: (data: UpdateCacheInput) => Promise<void>
  updateWithExpiresTime: (data: UpdateWithExpiresTimeInput) => Promise<void>
}
