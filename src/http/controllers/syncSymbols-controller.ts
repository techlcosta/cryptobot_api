import { BinanceRequestError } from '@/errors/binance-request-error'
import { makeSyncSymbolsUseCase } from '@/use-cases/factories/make-syncSymbols-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function syncSymbolsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const user_id = request.user.sub

    const syncSymbolsUseCase = makeSyncSymbolsUseCase()

    const { symbols } = await syncSymbolsUseCase.execute({ user_id })

    return await reply.status(200).send({ symbols })
  } catch (error) {
    if (error instanceof BinanceRequestError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
