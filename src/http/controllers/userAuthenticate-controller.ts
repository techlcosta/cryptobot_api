import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { userAuthenticateUseCaseFactory } from '@/use-cases/factories/factory-userAuthenticate-useCase'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function userAuthenticateController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  const userAuthenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { email, password } = userAuthenticateBodySchema.parse(request.body)

  try {
    const userAuthenticateUseCase = userAuthenticateUseCaseFactory()

    const { user } = await userAuthenticateUseCase.execute({
      email,
      password
    })

    const token = await reply.jwtSign({}, { sign: { sub: user.id } })

    const refreshToken = await reply.jwtSign({}, { sign: { sub: user.id, expiresIn: '7d' } })

    return await reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) return await reply.status(409).send({ message: error.message })

    throw error
  }
}
