import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { CryptographyAdapter } from '@/utils/cryptography/cryptography-adapter'
import { GetSettingsUseCase } from '../getSettings-useCase'

export function makeGetSettingsUseCase (): GetSettingsUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const cryptographyAdapter = new CryptographyAdapter()

  const getSettingsUseCase = new GetSettingsUseCase(settingsRepository, cryptographyAdapter)

  return getSettingsUseCase
}
