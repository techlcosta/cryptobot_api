import { prisma } from '@/lib/prisma'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Prisma, type Settings } from '@prisma/client'

export class PrismaSettingsRepository implements SettingsRepositoryInterface {
  async create (data: Prisma.SettingsUncheckedCreateInput): Promise<Settings> {
    const settings = await prisma.settings.create({ data })

    return settings
  }

  async update ({ user_id, accessKey, apiURL, secretKey, streamURL }: Prisma.SettingsUncheckedUpdateInput): Promise<Settings> {
    const settings = await prisma.settings.update({
      where: { user_id: user_id as string },
      data: {
        accessKey,
        secretKey,
        apiURL,
        streamURL
      }
    })

    return settings
  }

  async findByUserId (userId: string): Promise<Settings | null> {
    const settings = await prisma.settings.findUnique({
      where: {
        user_id: userId
      }
    })

    return settings
  }
}
