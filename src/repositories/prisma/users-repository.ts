import { prisma } from '@/lib/prisma'
import { type Prisma, type User } from '@prisma/client'
import { type UsersRepositoryInterface } from '../../interfaces/users-repository'

export class PrismaUsersRepository implements UsersRepositoryInterface {
  async create (data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({ data })

    return user
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    return user
  }

  async findById (userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }
}
