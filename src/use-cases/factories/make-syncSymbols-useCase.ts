import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { PrismaSymbolsRepository } from '@/repositories/prisma/symbols-repository'
import { exchangeInfo } from '@/services/binance-api/REST/SPOT/exchangeInfo/exchangeInfo'
import { SyncSymbolsUseCase } from '../syncSymbols-useCase'

export function makeSyncSymbolsUseCase (): SyncSymbolsUseCase {
  const settingsRepository = new PrismaSettingsRepository()

  const symbolsRepository = new PrismaSymbolsRepository()

  const syncSymbolsUseCase = new SyncSymbolsUseCase(settingsRepository, symbolsRepository, exchangeInfo)

  return syncSymbolsUseCase
}
