import { BinanceRest } from '@/client/binance-api/rest/binanceRest'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { GetWalletBalancesUseCase } from '../getWalletBalances-useCase'

export function getWalletBalancesUseCaseFactory (): GetWalletBalancesUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const binanceRest = new BinanceRest()
  const cryptography = new Cryptography()

  const getWalletBalancesUseCase = new GetWalletBalancesUseCase(settingsRepository, binanceRest, cryptography)

  return getWalletBalancesUseCase
}
