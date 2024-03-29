import { PrismaUsersRepository } from '@/repositories/prisma/users-repository'
import { UserRegisterUseCase } from '../userRegister-useCase'

export function userRegisterUseCaseFactory (): UserRegisterUseCase {
  const usersRepository = new PrismaUsersRepository()
  const userRegisterUseCase = new UserRegisterUseCase(usersRepository)

  return userRegisterUseCase
}
