import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { UserAuthenticateUseCase } from '../userAuthenticate-useCase'

export function userAuthenticateUseCaseFactory (): UserAuthenticateUseCase {
  const usersRepository = new PrismaUsersRepository()
  const userAuthenticateUseCase = new UserAuthenticateUseCase(usersRepository)

  return userAuthenticateUseCase
}
