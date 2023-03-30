import { type PrismaSettingsUpdateInput, type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
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

  async update ({ user_id, accessKey, secretKey, apiURL, streamURL }: PrismaSettingsUpdateInput): Promise<Settings> {
    const settingsIndex = this.memoryDatabase.findIndex(item => item.user_id === user_id)

    if (accessKey !== undefined) this.memoryDatabase[settingsIndex].accessKey = accessKey as string
    if (secretKey !== undefined) this.memoryDatabase[settingsIndex].secretKey = secretKey as string
    if (apiURL !== undefined) this.memoryDatabase[settingsIndex].apiURL = apiURL as string
    if (streamURL !== undefined) this.memoryDatabase[settingsIndex].streamURL = streamURL as string

    return this.memoryDatabase[settingsIndex]
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
