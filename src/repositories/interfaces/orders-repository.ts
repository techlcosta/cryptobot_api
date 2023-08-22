import { type Orders, type Prisma } from '@prisma/client'

export interface PrismaOrdersUpdateInput extends Prisma.OrdersUncheckedUpdateInput {
  id: string
}

export interface FindByuserIdAndOrderIdAndClientOrderIdInput {
  user_id: string
  order_id: number
  client_order_id: string
}

export interface OrdersRepositoryInterface {
  create: (data: Prisma.OrdersUncheckedCreateInput) => Promise<Orders>
  update: (data: PrismaOrdersUpdateInput) => Promise<Orders>
  findById: (id: string) => Promise<Orders | null>
  findByUserId: (user_id: string) => Promise<Orders[]>
  findByuserIdAndOrderIdAndClientOrderId: (data: FindByuserIdAndOrderIdAndClientOrderIdInput) => Promise<Orders | null>
}
