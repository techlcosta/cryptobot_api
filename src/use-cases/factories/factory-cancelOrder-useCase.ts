import { BinanceRest } from '@/client/binance-api/rest/binanceRest'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaOrdersRepository } from '@/repositories/prisma/orders-repository'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { CancelOrderUseCase } from '../cancelOrder-useCase'

export function cancelOrderUseCaseFactory (): CancelOrderUseCase {
  const ordersRepository = new PrismaOrdersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const binanceRest = new BinanceRest()
  const cryptography = new Cryptography()

  const cancelOrderUseCase = new CancelOrderUseCase(ordersRepository, settingsRepository, binanceRest, cryptography)

  return cancelOrderUseCase
}
