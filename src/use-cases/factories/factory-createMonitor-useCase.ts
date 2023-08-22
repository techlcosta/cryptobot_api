import { PrismaMonitorsRepository } from '@/repositories/prisma/monitors-repository'
import { PrismaSettingsRepository } from '@/repositories/prisma/settings-repository'
import { CreateMonitorUseCase } from '../createMonitor-useCase'

export function createMonitorUseCaseFactory (): CreateMonitorUseCase {
  const monitorsRepository = new PrismaMonitorsRepository()
  const settingsRepository = new PrismaSettingsRepository()

  const createMonitorUseCase = new CreateMonitorUseCase(monitorsRepository, settingsRepository)

  return createMonitorUseCase
}
