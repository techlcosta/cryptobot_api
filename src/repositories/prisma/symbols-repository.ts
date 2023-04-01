import { type PrismaSymbolsUpdateWithIdInput, type SymbolsRepositoryInterface } from '@/interfaces/symbols-repository'
import { prisma } from '@/lib/prisma'
import { type Prisma, type Symbols } from '@prisma/client'

export class SymbolsRepository implements SymbolsRepositoryInterface {
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

  async findById (id: string): Promise<Symbols | null> {
    const symbols = await prisma.symbols.findUnique({ where: { id } })

    return symbols
  }
}
