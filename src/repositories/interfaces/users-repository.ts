import { type Prisma, type Settings, type Users } from '@prisma/client'

export type UserWithSettings = Users & { settings: Settings | null }

export interface UsersRepositoryInterface {
  create: (data: Prisma.UsersCreateInput) => Promise<Users>
  findByEmail: (email: string) => Promise<Users | null>
  findById: (userId: string) => Promise<Users | null>
  allUsers: () => Promise<Users[]>
}
