import { prisma } from '@/lib/prisma'
import { type Prisma, type Users } from '@prisma/client'
import { type UsersRepositoryInterface } from '../interfaces/users-repository'

export class PrismaUsersRepository implements UsersRepositoryInterface {
  async create (data: Prisma.UsersCreateInput): Promise<Users> {
    const user = await prisma.users.create({ data })

    return user
  }

  async findByEmail (email: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        email
      }
    })

    return user
  }

  async findById (userId: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        id: userId
      }
    })

    return user
  }

  async allUsers (): Promise<Users[]> {
    const users = await prisma.users.findMany()

    return users
  }
}
