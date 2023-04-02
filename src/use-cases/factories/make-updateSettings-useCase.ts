
import { CryptographyAdapter } from '@/helpers/cryptography/cryptography-adapter'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { UpdateSettingsUseCase } from '../updateSettings-useCase'

export function makeUpdateSettingsUseCase (): UpdateSettingsUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const cryptographyAdapter = new CryptographyAdapter()

  const updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepository, cryptographyAdapter)

  return updateSettingsUseCase
}
