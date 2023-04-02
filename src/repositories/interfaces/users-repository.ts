import { type Prisma, type Settings, type User } from '@prisma/client'

export type UserWithSettings = User & { settings: Settings | null }

export interface UsersRepositoryInterface {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
  findById: (userId: string) => Promise<User | null>
}
