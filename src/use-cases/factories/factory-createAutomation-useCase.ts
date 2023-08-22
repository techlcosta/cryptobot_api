import { PrismaAutomationsRepository } from '@/repositories/prisma/automations-repository'
import { CreateAutomationUseCase } from '../createAutomation-useCase'

export function createAutomationUseCaseFactory (): CreateAutomationUseCase {
  const automationsRepository = new PrismaAutomationsRepository()

  const createAutomationUseCase = new CreateAutomationUseCase(automationsRepository)

  return createAutomationUseCase
}
