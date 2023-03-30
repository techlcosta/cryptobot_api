import { type Prisma, type Settings } from '@prisma/client'

export interface PrismaSettingsUpdateInput extends Prisma.SettingsUncheckedUpdateInput {
  user_id: string
}

export interface SettingsRepositoryInterface {
  create: (data: Prisma.SettingsUncheckedCreateInput) => Promise<Settings>
  update: (data: PrismaSettingsUpdateInput) => Promise<Settings>
  findByUserId: (userId: string) => Promise<Settings | null>
}
