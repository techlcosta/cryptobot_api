import { type FastifyInstance } from 'fastify'
import { getUserProfileController } from '../controllers/getUserProfile-controller'
import { saveSettingsController } from '../controllers/saveSettings-controller'
import { userAuthenticateController } from '../controllers/userAuthenticate-controller'
import { userRefreshTokenController } from '../controllers/userRefreshToken-controller'
import { userRegisterController } from '../controllers/userRegister-controller'
import { verifyJWT } from '../middlewares/verify-jwt'

export async function appRoutes (app: FastifyInstance): Promise<void> {
  app.post('/register', userRegisterController)
  app.post('/session', userAuthenticateController)

  app.patch('/token/refresh', userRefreshTokenController)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJWT] }, getUserProfileController)
  app.post('/settings/save', { onRequest: [verifyJWT] }, saveSettingsController)
}
