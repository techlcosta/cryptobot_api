
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { UpdateSettingsUseCase } from '../updateSettings-useCase'

export function updateSettingsUseCaseFactory (): UpdateSettingsUseCase {
  const settingsRepository = new PrismaSettingsRepository()
  const cryptography = new Cryptography()

  const updateSettingsUseCase = new UpdateSettingsUseCase(settingsRepository, cryptography)

  return updateSettingsUseCase
}
