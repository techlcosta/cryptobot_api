
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { CryptographyAdapter } from '@/utils/cryptography/cryptography-adapter'
import { UpdateSettingsUseCase } from '../updateSettings-useCase'

export function makeUpdateSettingsUseCase (): UpdateSettingsUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const cryptographyAdapter = new CryptographyAdapter()

  const updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepository, cryptographyAdapter)

  return updateSettingsUseCase
}
