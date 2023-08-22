import { app } from './app'
import { env } from './env'
import { startExchangeMonitors } from './exchange'

void app.listen({
  host: '0.0.0.0',
  port: env.PORT
}).then(() => {
  console.log('🚀 Server is Running!')

  void startExchangeMonitors()
})
