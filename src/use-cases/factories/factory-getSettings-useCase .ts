import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { GetSettingsUseCase } from '../getSettings-useCase'

export function getSettingsUseCaseFactory (): GetSettingsUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const cryptography = new Cryptography()

  const getSettingsUseCase = new GetSettingsUseCase(settingsRepository, cryptography)

  return getSettingsUseCase
}
