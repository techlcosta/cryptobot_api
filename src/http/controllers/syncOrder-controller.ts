import { BinanceError } from '@/errors/binance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { syncOrderUseCaseFactory } from '@/use-cases/factories/factory-syncOrder-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function syncOrderController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const syncOrderSchema = z.object({
    id: z.string().nonempty()
  })

  const user_id = request.user.sub

  const { id } = syncOrderSchema.parse(request.query)

  try {
    const syncOrderUseCase = syncOrderUseCaseFactory()

    const { order } = await syncOrderUseCase.execute({ user_id, id })

    return await reply.status(200).send({ order })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
