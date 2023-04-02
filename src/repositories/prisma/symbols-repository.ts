import { prisma } from '@/lib/prisma'
import { type PrismaSymbolsFindUniqueByUserIdAndSymbol, type PrismaSymbolsUpdateWithIdInput, type SymbolsRepositoryInterface } from '@/repositories/interfaces/symbols-repository'
import { type Prisma, type Symbols } from '@prisma/client'

export class PrismaSymbolsRepository implements SymbolsRepositoryInterface {
  async create (data: Prisma.SymbolsUncheckedCreateInput): Promise<Symbols> {
    const symbols = await prisma.symbols.create({ data })

    return symbols
  }

  async update (data: PrismaSymbolsUpdateWithIdInput): Promise<Symbols> {
    const { id, ...rest } = data

    const symbols = await prisma.symbols.update({
      where: {
        id
      },
      data: rest
    })

    return symbols
  }

  async findByUserId (user_id: string): Promise<Symbols[]> {
    const symbols = await prisma.symbols.findMany({
      where: {
        user_id
      }
    })

    return symbols
  }

  async findByUserIdAndSymbol (data: PrismaSymbolsFindUniqueByUserIdAndSymbol): Promise<Symbols | null> {
    const symbols = await prisma.symbols.findUnique({
      where: {
        user_id_symbol: data
      }
    })

    return symbols
  }
}
