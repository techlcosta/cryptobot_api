import { BinanceError } from '@/errors/binance-error'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { newSpotOrderUseCaseFactory } from '@/use-cases/factories/factory-newSpotOrder-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function newSpotOrderController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const NewSpotOrderSchema = z.object({
    type: z.enum(['LIMIT', 'MARKET', 'STOP_LOSS', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT', 'LIMIT_MAKER', 'OCO']),
    symbol: z.string().nonempty(),
    side: z.enum(['BUY', 'SELL']),
    quantity: z.string().nonempty(),
    price: z.string().optional(),
    stopPrice: z.string().optional()
  }).superRefine((value, ctx) => {
    if ((value.type === 'LIMIT' ||
        value.type === 'STOP_LOSS_LIMIT' ||
        value.type === 'TAKE_PROFIT_LIMIT' ||
        value.type === 'LIMIT_MAKER' ||
        value.type === 'OCO') && !value.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'price is missing.'
      })
    }
    if ((value.type === 'STOP_LOSS' ||
    value.type === 'STOP_LOSS_LIMIT' ||
    value.type === 'TAKE_PROFIT' ||
    value.type === 'TAKE_PROFIT_LIMIT' ||
    value.type === 'OCO') && !value.stopPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'stopPrice is misssing.'
      })
    }
  })

  const user_id = request.user.sub

  const { symbol, side, type, quantity, price, stopPrice } = NewSpotOrderSchema.parse(request.body)
  try {
    const newSpotOrderUseCase = newSpotOrderUseCaseFactory()

    const { order } = await newSpotOrderUseCase.execute({
      user_id,
      symbol,
      side,
      type,
      quantity,
      price,
      stopPrice
    })

    return await reply.status(201).send({ order })
  } catch (error) {
    if (error instanceof BinanceError) return await reply.status(400).send({ message: error.message })
    if (error instanceof ResourceNotFoundError) return await reply.status(401).send({ message: error.message })

    throw error
  }
}
