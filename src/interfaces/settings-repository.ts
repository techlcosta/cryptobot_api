import { type Prisma, type Settings } from '@prisma/client'

export interface SettingsRepositoryInterface {
  create: (data: Prisma.SettingsUncheckedCreateInput) => Promise<Settings>
  findByUserId: (userId: string) => Promise<Settings | null>
}
