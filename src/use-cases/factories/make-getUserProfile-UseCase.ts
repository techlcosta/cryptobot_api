import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { GetUserProfileUseCase } from '../getUserProfile-useCase'

export function makeGetUserProfileUseCase (): GetUserProfileUseCase {
  const usersRepository = new PrismaUsersRepository()

  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
