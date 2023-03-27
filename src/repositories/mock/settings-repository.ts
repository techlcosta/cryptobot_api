import { type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
import { type Prisma, type Settings } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemorySettingsRepository implements SettingsRepositoryInterface {
  private readonly memoryDatabase: Settings[] = []

  async create (data: Prisma.SettingsUncheckedCreateInput): Promise<Settings> {
    const settings = {
      id: randomUUID(),
      accessKey: data.accessKey,
      apiURL: data.apiURL,
      secretKey: data.secretKey,
      streamURL: data.streamURL,
      user_id: data.user_id,
      created_at: new Date()
    }

    this.memoryDatabase.push(settings)

    return settings
  }

  async findByUserId (userId: string): Promise<Settings | null> {
    const settings = this.memoryDatabase.find(item => item.user_id === userId)

    if (settings === undefined) return null

    return settings
  }

  async findById (userId: string): Promise<Settings | null> {
    const settings = this.memoryDatabase.find(item => item.id === userId)

    if (settings === undefined) return null

    return settings
  }
}
