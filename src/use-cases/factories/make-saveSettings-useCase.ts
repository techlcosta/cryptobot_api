import { EncryptAdapter } from '@/adapters/encrypt'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { SaveSettingsUseCase } from '../saveSettings-useCase'

export function makeSaveSettingsUseCase (): SaveSettingsUseCase {
  const usersRepository = new PrismaUsersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const encryptAdapter = new EncryptAdapter()

  const saveSettingsUseCase = new SaveSettingsUseCase(usersRepository, settingsRepository, encryptAdapter)

  return saveSettingsUseCase
}
