import { type Prisma, type Settings, type User } from '@prisma/client'

export type UserWithSettings = User & { settings: Settings | null }

export interface UsersRepositoryInterface {
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findByEmail: (email: string) => Promise<UserWithSettings | null>
  findById: (userId: string) => Promise<UserWithSettings | null>
}
