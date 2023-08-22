import { type Automations, type Prisma } from '@prisma/client'

export interface FindByUserIdAndSymbolAndNameInput {
  name: string
  symbol: string
  user_id: string
}

export interface AutomationsRepositoryInterface {
  create: (data: Prisma.AutomationsUncheckedCreateInput) => Promise<Automations>
  findByUserIdAndSymbolAndName: (data: FindByUserIdAndSymbolAndNameInput) => Promise<Automations | null>
}
