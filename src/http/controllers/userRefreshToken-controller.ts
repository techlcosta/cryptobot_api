import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function userRefreshTokenController (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign({}, { sign: { sub: request.user.sub } })

  const refreshToken = await reply.jwtSign({}, { sign: { sub: request.user.sub, expiresIn: '7d' } })

  return await reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true
    })
    .status(200)
    .send({ token })
}
