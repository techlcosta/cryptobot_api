import { BinanceError } from '@/errors/binance-error'
import { MonitorAlredyExistsError } from '@/errors/monitor-alredy-exists-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { createMonitorUseCaseFactory } from '@/use-cases/factories/factory-createMonitor-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createMonitorController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const { sub: user_id } = request.user

  const createMonitorSchema = z.object({
    symbol: z.string().nonempty(),
    type: z.enum(['SPOT_CHART']),
    interval: z.string().nonempty(),
    is_active: z.boolean().default(false),
    indexes: z.object({
      type: z.enum(['RSI', 'EMA', 'SMA']),
      params: z.string().nonempty()
    }).array().nonempty()
  })

  const { symbol, type, interval, is_active, indexes } = createMonitorSchema.parse(request.body)

  try {
    const createMonitorUseCase = createMonitorUseCaseFactory()

    const { monitor } = await createMonitorUseCase.execute({ symbol, type, interval, is_active, indexes, user_id })

    return await reply.status(201).send({ monitor })
  } catch (error) {
    if (error instanceof MonitorAlredyExistsError) return await reply.status(400).send({ message: error.message })
    if (error instanceof ResourceNotFoundError) return await reply.status(400).send({ message: error.message })
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })

    throw error
  }
}
