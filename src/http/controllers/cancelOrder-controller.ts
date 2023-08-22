import { BinanceError } from '@/errors/binance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { cancelOrderUseCaseFactory } from '@/use-cases/factories/factory-cancelOrder-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function cancelOrderController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const cancelOrderSchema = z.object({
    id: z.string().nonempty()
  })

  const user_id = request.user.sub

  const { id } = cancelOrderSchema.parse(request.query)

  try {
    const cancelOrderUseCase = cancelOrderUseCaseFactory()

    const { order } = await cancelOrderUseCase.execute({ user_id, id })

    return await reply.status(200).send({ order })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
