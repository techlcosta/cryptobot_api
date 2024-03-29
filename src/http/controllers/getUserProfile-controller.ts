import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { getUserProfileUseCaseFactory } from '@/use-cases/factories/factory-getUserProfile-useCase'

import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function getUserProfileController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const getUserProfileUseCase = getUserProfileUseCaseFactory()

    const userId = request.user.sub

    const { user } = await getUserProfileUseCase.execute({ userId })

    return await reply.status(200).send({
      user: {
        ...user,
        password_hash: undefined
      }
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })

    throw error
  }
}
