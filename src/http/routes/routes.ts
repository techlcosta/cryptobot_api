import { type FastifyInstance } from 'fastify'
import { cancelOrderController } from '../controllers/cancelOrder-controller'
import { createAutomationController } from '../controllers/createAutomation-controller'
import { createMonitorController } from '../controllers/createMonitor-controller'
import { getSettingsController } from '../controllers/getSettings-controller'
import { getUserProfileController } from '../controllers/getUserProfile-controller'
import { getWalletBalancesController } from '../controllers/getWalletBalances-controller'
import { newSpotOrderController } from '../controllers/newSpotOrder-controller'
import { saveSettingsController } from '../controllers/saveSettings-controller'
import { syncOrderController } from '../controllers/syncOrder-controller'
import { syncSymbolsController } from '../controllers/syncSymbols-controller'
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
  app.get('/account/me', { onRequest: [verifyJWT] }, getUserProfileController)
  app.get('/account/balance', { onRequest: [verifyJWT] }, getWalletBalancesController)

  app.get('/settings', { onRequest: [verifyJWT] }, getSettingsController)
  app.post('/settings', { onRequest: [verifyJWT] }, saveSettingsController)
  app.patch('/settings', { onRequest: [verifyJWT] }, updateSettingsController)

  app.get('/symbols/sync', { onRequest: [verifyJWT] }, syncSymbolsController)

  app.post('/order', { onRequest: [verifyJWT] }, newSpotOrderController)
  app.get('/order/sync', { onRequest: [verifyJWT] }, syncOrderController)
  app.get('/order/cancel', { onRequest: [verifyJWT] }, cancelOrderController)

  app.post('/monitor', { onRequest: [verifyJWT] }, createMonitorController)

  app.post('/automation', { onRequest: [verifyJWT] }, createAutomationController)

  /** Websockets */
  app.get('/test', { websocket: true, onRequest: [verifyJWT] }, (connection, request) => {
    console.log(request.user.sub)
    setInterval(() => {
      connection.socket.send('xxxx')
    }, 1000)
  })
}
