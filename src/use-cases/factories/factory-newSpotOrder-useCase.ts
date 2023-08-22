import { BinanceRest } from '@/client/binance-api/rest/binanceRest'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaOrdersRepository } from '@/repositories/prisma/orders-repository'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { NewSpotOrderUseCase } from '../newSpotOrder-useCase'

export function newSpotOrderUseCaseFactory (): NewSpotOrderUseCase {
  const settingsRepository = new PrismaSettingsRepository()

  const ordersRepository = new PrismaOrdersRepository()

  const binanceRest = new BinanceRest()

  const cryptography = new Cryptography()

  const newSpotOrderUseCase = new NewSpotOrderUseCase(settingsRepository, ordersRepository, binanceRest, cryptography)

  return newSpotOrderUseCase
}
