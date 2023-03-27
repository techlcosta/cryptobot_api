import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-getUserProfile-UseCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function getUserProfileController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase()

    const { user } = await getUserProfileUseCase.execute({ userId: request.user.sub })

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
