import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { updateSettingsUseCaseFactory } from '@/use-cases/factories/factory-updateSettings-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const updateSettingsBodySchema = z.object({
    apiKey: z.string().min(10).optional(),
    apiURL: z.string().min(10).optional(),
    secretKey: z.string().min(10).optional(),
    streamURL: z.string().min(10).optional()

  })

  const { apiKey, apiURL, secretKey, streamURL } = updateSettingsBodySchema.parse(request.body)

  const user_id = request.user.sub

  try {
    const updateSettingsUseCase = updateSettingsUseCaseFactory()

    await updateSettingsUseCase.execute({
      user_id,
      apiKey,
      apiURL,
      secretKey,
      streamURL
    })

    return await reply.status(200).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })

    throw error
  }
}
