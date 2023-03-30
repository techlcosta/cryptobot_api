import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { makeSaveSettingsUseCase } from '@/use-cases/factories/make-saveSettings-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function saveSettingsController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const saveSettingsBodySchema = z.object({
    accessKey: z.string().min(10),
    apiURL: z.string().min(10),
    secretKey: z.string().min(10),
    streamURL: z.string().min(10)

  })

  const { accessKey, apiURL, secretKey, streamURL } = saveSettingsBodySchema.parse(request.body)

  const user_id = request.user.sub

  console.log(user_id)

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
    if (error instanceof SettingsAlredyExistsError) return await reply.status(409).send({ message: error.message })

    throw error
  }
}
