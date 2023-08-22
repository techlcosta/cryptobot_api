import { BinanceRest } from '@/client/binance-api/rest/binanceRest'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaOrdersRepository } from '@/repositories/prisma/orders-repository'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { SyncOrderUseCase } from '../syncOrder-useCase'

export function syncOrderUseCaseFactory (): SyncOrderUseCase {
  const ordersRepository = new PrismaOrdersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const binanceRest = new BinanceRest()
  const cryptography = new Cryptography()

  const syncOrderUseCase = new SyncOrderUseCase(ordersRepository, settingsRepository, binanceRest, cryptography)

  return syncOrderUseCase
}
