import { type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
import { prisma } from '@/lib/prisma'
import { type Prisma, type Settings } from '@prisma/client'

export class PrismaSettingsRepository implements SettingsRepositoryInterface {
  async create (data: Prisma.SettingsUncheckedCreateInput): Promise<Settings> {
    const settings = await prisma.settings.create({ data })

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
