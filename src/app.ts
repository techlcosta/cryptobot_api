import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import websocket from '@fastify/websocket'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes/routes'

export const app = fastify({ logger: env.NODE_ENV === 'dev' })

void app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false
  },
  sign: {
    expiresIn: '1d'
  }
})

void app.register(websocket)

void app.register(fastifyCookie)

void app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // here we should to an external tool
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation error.', issues: error.format() })
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
