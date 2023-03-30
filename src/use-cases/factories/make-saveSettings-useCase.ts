
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { CryptographyAdapter } from '@/utils/cryptography/cryptography-adapter'
import { SaveSettingsUseCase } from '../saveSettings-useCase'

export function makeSaveSettingsUseCase (): SaveSettingsUseCase {
  const usersRepository = new PrismaUsersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const cryptographyAdapter = new CryptographyAdapter()

  const saveSettingsUseCase = new SaveSettingsUseCase(usersRepository, settingsRepository, cryptographyAdapter)

  return saveSettingsUseCase
}
