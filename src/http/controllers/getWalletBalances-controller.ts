import { BinanceError } from '@/errors/binance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { getWalletBalancesUseCaseFactory } from '@/use-cases/factories/factory-getWalletBalances-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function getWalletBalancesController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const user_id = request.user.sub

  try {
    const getWalletBalancesUseCase = getWalletBalancesUseCaseFactory()

    const { balances } = await getWalletBalancesUseCase.execute({ user_id })

    return await reply.status(200).send({ balances })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
