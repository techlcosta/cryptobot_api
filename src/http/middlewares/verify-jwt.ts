import { type VerifyPayloadType } from '@fastify/jwt'
import { type FastifyReply, type FastifyRequest } from 'fastify'

export async function verifyJWT (request: FastifyRequest, reply: FastifyReply): Promise<VerifyPayloadType | FastifyReply> {
  try {
    return await request.jwtVerify()
  } catch (error) {
    return await reply.status(401).send({ message: 'Unauthorized' })
  }
}
