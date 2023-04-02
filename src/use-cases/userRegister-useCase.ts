import { type User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlredyExistsError } from '../errors/user-alredy-exists-error'
import { type UsersRepositoryInterface } from '../repositories/interfaces/users-repository'

interface UserRegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface UserRegisterUseCaseResponse {
  user: User
}

export class UserRegisterUseCase {
  constructor (private readonly userRepository: UsersRepositoryInterface) {}

  async execute ({ name, email, password }: UserRegisterUseCaseRequest): Promise< UserRegisterUseCaseResponse > {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail !== null) throw new UserAlredyExistsError()

    const user = await this.userRepository.create({
      name,
      email,
      password_hash
    })

    return {
      user
    }
  }
}
