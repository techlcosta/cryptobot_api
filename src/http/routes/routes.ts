import { type FastifyInstance } from 'fastify'
import { getSettingsController } from '../controllers/getSettings-controller'
import { getUserProfileController } from '../controllers/getUserProfile-controller'
import { saveSettingsController } from '../controllers/saveSettings-controller'
import { updateSettingsController } from '../controllers/updateSettings-controller'
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
  app.get('/settings', { onRequest: [verifyJWT] }, getSettingsController)
  app.post('/settings/save', { onRequest: [verifyJWT] }, saveSettingsController)
  app.patch('/settings/edit', { onRequest: [verifyJWT] }, updateSettingsController)
}
