import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { saveSettingsUseCaseFactory } from '@/use-cases/factories/factory-saveSettings-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function saveSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const saveSettingsBodySchema = z.object({
    apiKey: z.string().min(10).nonempty(),
    apiURL: z.string().min(10).nonempty(),
    secretKey: z.string().min(10).nonempty(),
    streamURL: z.string().min(10).nonempty()

  })

  const { apiKey, apiURL, secretKey, streamURL } = saveSettingsBodySchema.parse(request.body)

  const user_id = request.user.sub

  try {
    const saveSettingsUseCase = saveSettingsUseCaseFactory()

    await saveSettingsUseCase.execute({
      user_id,
      apiKey,
      apiURL,
      secretKey,
      streamURL
    })

    return await reply.status(201).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })
    if (error instanceof SettingsAlredyExistsError) return await reply.status(409).send({ message: error.message })

    throw error
  }
}
