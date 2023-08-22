import { prisma } from '@/lib/prisma'
import { type Orders, type Prisma } from '@prisma/client'
import { type FindByuserIdAndOrderIdAndClientOrderIdInput, type OrdersRepositoryInterface, type PrismaOrdersUpdateInput } from '../interfaces/orders-repository'

export class PrismaOrdersRepository implements OrdersRepositoryInterface {
  async create (data: Prisma.OrdersUncheckedCreateInput): Promise<Orders> {
    const order = await prisma.orders.create({ data })

    return order
  }

  async update ({ id, ...rest }: PrismaOrdersUpdateInput): Promise<Orders> {
    const order = await prisma.orders.update({
      where: { id },
      data: { ...rest }
    })

    return order
  }

  async findById (id: string): Promise<Orders | null> {
    const order = await prisma.orders.findUnique({
      where: {
        id
      }
    })

    return order
  }

  async findByUserId (user_id: string): Promise<Orders[]> {
    const orders = await prisma.orders.findMany({
      where: {
        user_id
      }
    })

    return orders
  }

  async findByuserIdAndOrderIdAndClientOrderId ({ user_id, order_id, client_order_id }: FindByuserIdAndOrderIdAndClientOrderIdInput): Promise<Orders | null> {
    const order = await prisma.orders.findUnique({
      where: {
        user_id_order_id_client_order_id: {
          user_id,
          order_id,
          client_order_id
        }
      }
    })

    return order
  }
}
