import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { getSettingsUseCaseFactory } from '@/use-cases/factories/factory-getSettings-useCase '

import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function getSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const getSettingsUseCase = getSettingsUseCaseFactory()

    const user_id = request.user.sub

    const { settings } = await getSettingsUseCase.execute({ user_id })

    return await reply.status(200).send({
      settings
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })

    throw error
  }
}
