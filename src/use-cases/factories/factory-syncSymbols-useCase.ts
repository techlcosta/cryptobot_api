import { BinanceRest } from '@/client/binance-api/rest/binanceRest'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { PrismaSymbolsRepository } from '@/repositories/prisma/symbols-repository'
import { SyncSymbolsUseCase } from '../syncSymbols-useCase'

export function syncSymbolsUseCaseFactory (): SyncSymbolsUseCase {
  const settingsRepository = new PrismaSettingsRepository()

  const symbolsRepository = new PrismaSymbolsRepository()

  const binanceRest = new BinanceRest()

  const syncSymbolsUseCase = new SyncSymbolsUseCase(settingsRepository, symbolsRepository, binanceRest)

  return syncSymbolsUseCase
}
