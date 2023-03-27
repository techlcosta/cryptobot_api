import { type User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { type UsersRepositoryInterface } from '../interfaces/users-repository'

interface UserAuthenticateUseCaseRequest {
  email: string
  password: string
}

interface UserAuthenticateUseCaseResponse {
  user: User
}

export class UserAuthenticateUseCase {
  constructor (private readonly usersRepository: UsersRepositoryInterface) {}

  async execute ({ email, password }: UserAuthenticateUseCaseRequest): Promise<UserAuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (user === null) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      user
    }
  }
}
