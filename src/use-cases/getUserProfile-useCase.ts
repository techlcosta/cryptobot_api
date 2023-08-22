import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type UsersRepositoryInterface } from '@/repositories/interfaces/users-repository'
import { type Users } from '@prisma/client'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: Users
}
export class GetUserProfileUseCase {
  constructor (private readonly usersRepository: UsersRepositoryInterface) {}

  async execute ({ userId }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) throw new ResourceNotFoundError()

    return { user }
  }
}
