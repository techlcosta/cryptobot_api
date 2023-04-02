import { type Prisma, type Symbols } from '@prisma/client'

export interface PrismaSymbolsUpdateWithIdInput extends Prisma.SymbolsUncheckedUpdateInput {
  id: string
}

export interface PrismaSymbolsFindUniqueByUserIdAndSymbol {
  user_id: string
  symbol: string
}

export interface SymbolsRepositoryInterface {
  create: (data: Prisma.SymbolsUncheckedCreateInput) => Promise<Symbols>
  update: (data: PrismaSymbolsUpdateWithIdInput) => Promise<Symbols>
  findByUserId: (user_id: string) => Promise<Symbols[]>
  findByUserIdAndSymbol: (data: PrismaSymbolsFindUniqueByUserIdAndSymbol) => Promise<Symbols | null>
}
