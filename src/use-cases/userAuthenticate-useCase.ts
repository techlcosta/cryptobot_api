import { type Users } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { type UsersRepositoryInterface } from '../repositories/interfaces/users-repository'

interface UserAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface UserAuthenticateUseCaseResponse {
  user: Users
}

export class UserAuthenticateUseCase {
  constructor (private readonly usersRepository: UsersRepositoryInterface) {}

  async execute ({ email, password }: UserAuthenticateUseCaseRequest): Promise<UserAuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      user
    }
  }
}
