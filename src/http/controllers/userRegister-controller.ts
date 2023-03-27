import { makeUserRegisterUseCase } from '@/use-cases/factories/make-userRegister-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserAlredyExistsError } from '../../errors/user-alredy-exists-error'

export async function userRegisterController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const userRegisterBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { name, email, password } = userRegisterBodySchema.parse(request.body)

  try {
    const userRegisterUseCase = makeUserRegisterUseCase()

    await userRegisterUseCase.execute({
      name,
      email,
      password
    })

    return await reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlredyExistsError) return await reply.status(409).send({ message: error.message })

    throw error
  }
}
