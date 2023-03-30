import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { makeSaveSettingsUseCase } from '@/use-cases/factories/make-saveSettings-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function saveSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const saveSettingsBodySchema = z.object({
    accessKey: z.string(),
    apiURL: z.string(),
    secretKey: z.string(),
    streamURL: z.string()

  })

  const { accessKey, apiURL, secretKey, streamURL } = saveSettingsBodySchema.parse(request.body)

  const user_id = request.user.sub

  try {
    const saveSettingsUseCase = makeSaveSettingsUseCase()

    await saveSettingsUseCase.execute({
      user_id,
      accessKey,
      apiURL,
      secretKey,
      streamURL
    })

    return await reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })

    throw error
  }
}
