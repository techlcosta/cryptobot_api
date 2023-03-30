import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeUpdateSettingsUseCase } from '@/use-cases/factories/make-updateSettings-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const updateSettingsBodySchema = z.object({
    accessKey: z.string().optional(),
    apiURL: z.string().optional(),
    secretKey: z.string().optional(),
    streamURL: z.string().optional()

  })

  const { accessKey, apiURL, secretKey, streamURL } = updateSettingsBodySchema.parse(request.body)

  const user_id = request.user.sub

  try {
    const updateSettingsUseCase = makeUpdateSettingsUseCase()

    await updateSettingsUseCase.execute({
      user_id,
      accessKey,
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
