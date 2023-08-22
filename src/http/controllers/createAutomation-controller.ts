
import { AutomationAlredyExistsError } from '@/errors/automation-alredy-exists-error'
import { createAutomationUseCaseFactory } from '@/use-cases/factories/factory-createAutomation-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createAutomationController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const { sub: user_id } = request.user

  const createAutomationSchema = z.object({
    symbol: z.string().nonempty(),
    name: z.string().nonempty(),
    conditions: z.string().nonempty(),
    schedule: z.string().optional(),
    is_active: z.boolean().default(false),
    indexes: z.string().array()
  })

  const { symbol, name, conditions, schedule, is_active, indexes } = createAutomationSchema.parse(request.body)

  try {
    const createAutomationUseCase = createAutomationUseCaseFactory()

    const { automation } = await createAutomationUseCase.execute({ symbol, name, conditions, schedule, is_active, indexes, user_id })

    return await reply.status(201).send({ automation })
  } catch (error) {
    if (error instanceof AutomationAlredyExistsError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
