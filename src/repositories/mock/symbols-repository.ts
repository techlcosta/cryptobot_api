
import { type Prisma, type Symbols } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { type PrismaSymbolsFindUniqueByUserIdAndSymbol, type PrismaSymbolsUpdateWithIdInput, type SymbolsRepositoryInterface } from '../interfaces/symbols-repository'

export class InMemorySymbolsRepository implements SymbolsRepositoryInterface {
  private readonly memoryDatabase: Symbols[] = []

  async create ({ base, base_precision, is_favorite, min_lot_size, min_notional, quote, quote_precision, symbol, user_id }: Prisma.SymbolsUncheckedCreateInput): Promise<Symbols> {
    const data: Symbols = {
      id: randomUUID(),
      base,
      base_precision,
      is_favorite,
      min_lot_size,
      min_notional,
      quote,
      quote_precision,
      symbol,
      user_id,
      created_at: new Date()
    }
    this.memoryDatabase.push(data)

    return data
  }

  async update (data: PrismaSymbolsUpdateWithIdInput): Promise<Symbols> {
    const currentSymbolsIndex = this.memoryDatabase.findIndex(item => item.id === data.id)

    this.memoryDatabase[currentSymbolsIndex].min_notional = data.min_notional as string
    this.memoryDatabase[currentSymbolsIndex].min_lot_size = data.min_lot_size as string
    this.memoryDatabase[currentSymbolsIndex].base = data.base as string
    this.memoryDatabase[currentSymbolsIndex].quote = data.quote as string
    this.memoryDatabase[currentSymbolsIndex].base_precision = data.base_precision as number
    this.memoryDatabase[currentSymbolsIndex].quote_precision = data.quote_precision as number

    return this.memoryDatabase[currentSymbolsIndex]
  }

  async findByUserId (user_id: string): Promise<Symbols[]> {
    const symbols = this.memoryDatabase.filter(item => item.user_id === user_id)

    return symbols
  }

  async findByUserIdAndSymbol (data: PrismaSymbolsFindUniqueByUserIdAndSymbol): Promise<Symbols | null> {
    const symbols = this.memoryDatabase.find(item => item.symbol === data.symbol && item.user_id === data.user_id)

    if (symbols === undefined) return null

    return symbols
  }
}
