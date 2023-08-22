import { redis } from '@/lib/ioredis'
import { type CacheRepositoryInterface, type ListenerInput, type SubscribeInput, type UpdateCacheInput, type UpdateWithExpiresTimeInput } from '../interfaces/cache-repository'

interface KeyFactoryInput {
  user_id: string
  symbol: string
  index: string
  interval?: string
}

export class RedisCacheRepository implements CacheRepositoryInterface {
  private readonly publisher = redis.duplicate()

  async update ({ user_id, symbol, index, interval, value }: UpdateCacheInput): Promise<void> {
    const key = await this.keyFactory({ user_id, symbol, index, interval })
    await redis.set(key, value)
  }

  async updateWithExpiresTime ({ user_id, symbol, index, interval, value, expiresIn, notify }: UpdateWithExpiresTimeInput): Promise<void> {
    const key = await this.keyFactory({ user_id, symbol, index, interval })
    await redis.set(key, value, 'EX', expiresIn)
    if (notify) notify(key)
  }

  async subscribe ({ chanel }: SubscribeInput): Promise<void> {
    await this.publisher.subscribe(chanel)
  }

  async listener ({ chanel, callback }: ListenerInput): Promise<void> {
    this.publisher.on('message', (messageChanel, message) => {
      if (chanel === messageChanel) {
        const data = { [messageChanel]: JSON.parse(message) }

        void callback(data)
      }
    })
  }

  private async keyFactory ({ user_id, symbol, index, interval }: KeyFactoryInput): Promise<string> {
    if (!interval) return `${user_id}&${index}:${symbol}`
    else return `${user_id}&${index}:${symbol}-${interval}`
  }
}
