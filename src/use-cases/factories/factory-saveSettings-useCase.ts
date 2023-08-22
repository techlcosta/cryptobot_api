
import { BinanceExchangeActions } from '@/helpers/binanceExchange/binanceExchangeActions'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { SaveSettingsUseCase } from '../saveSettings-useCase'

export function saveSettingsUseCaseFactory (): SaveSettingsUseCase {
  const usersRepository = new PrismaUsersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const cryptography = new Cryptography()
  const binanceExchangeActions = new BinanceExchangeActions()

  const saveSettingsUseCase = new SaveSettingsUseCase(usersRepository, settingsRepository, cryptography, binanceExchangeActions)

  return saveSettingsUseCase
}
