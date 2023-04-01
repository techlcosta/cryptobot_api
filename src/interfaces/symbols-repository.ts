import { type Prisma, type Symbols } from '@prisma/client'

export interface PrismaSymbolsUpdateWithIdInput extends Prisma.SymbolsUncheckedCreateInput {
  id: string
}

export interface SymbolsRepositoryInterface {
  create: (data: Prisma.SymbolsUncheckedCreateInput) => Promise<Symbols>
  update: (data: PrismaSymbolsUpdateWithIdInput) => Promise<Symbols>
  findById: (id: string) => Promise<Symbols | null>
}
