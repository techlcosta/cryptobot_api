import { BinanceError } from '@/errors/binance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { syncSymbolsUseCaseFactory } from '@/use-cases/factories/factory-syncSymbols-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function syncSymbolsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const user_id = request.user.sub

    const syncSymbolsUseCase = syncSymbolsUseCaseFactory()

    const { symbols } = await syncSymbolsUseCase.execute({ user_id })

    return await reply.status(200).send({ symbols })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
