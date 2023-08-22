import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetUserProfileUseCase } from '../getUserProfile-useCase'

export function getUserProfileUseCaseFactory (): GetUserProfileUseCase {
  const usersRepository = new PrismaUsersRepository()

  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
