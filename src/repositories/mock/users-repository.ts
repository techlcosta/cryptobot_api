import { type Prisma, type User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { type UsersRepositoryInterface, type UserWithSettings } from '../../interfaces/users-repository'

export class InMemoryUsersRepository implements UsersRepositoryInterface {
  private readonly memoryDatabase: User[] = []

  async create (data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    }

    this.memoryDatabase.push(user)

    return user
  }

  async findByEmail (email: string): Promise<UserWithSettings | null> {
    const user = this.memoryDatabase.find(item => item.email === email)

    if (user === undefined) return null

    return {
      ...user,
      settings: null
    }
  }

  async findById (userId: string): Promise<UserWithSettings | null> {
    const user = this.memoryDatabase.find(item => item.id === userId)

    if (user === undefined) return null

    return {
      ...user,
      settings: null
    }
  }
}
