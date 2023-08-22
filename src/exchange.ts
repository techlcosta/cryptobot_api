
import { BinanceExchangeActions } from './helpers/binanceExchange/binanceExchangeActions'
import { PrismaMonitorsRepository } from './repositories/prisma/monitors-repository'
import { PrismaSettingsRepository } from './repositories/prisma/settings-repository'
import { PrismaUsersRepository } from './repositories/prisma/users-repository'
import { onStartMonitorsUseCaseFactory } from './use-cases/factories/factory-onStartMonitors-useCase'

export async function startExchangeMonitors (): Promise<void> {
  const usersRepository = new PrismaUsersRepository()
  const settingsRepository = new PrismaSettingsRepository()
  const monitorsRepository = new PrismaMonitorsRepository()
  const binance = new BinanceExchangeActions()

  const users = await usersRepository.allUsers()

  await binance.startSpotTicker()

  for (const user of users) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        (async (): Promise<void> => {
          const settings = await settingsRepository.findByUserId(user.id)

          if (!settings) return

          await binance.startSpotUserData({ user_id: settings.user_id, apiURL: settings.apiURL, streamURL: settings.streamURL, apiKey: settings.apiKey })

          const monitors = await monitorsRepository.findByUserId(user.id)

          for (const monitor of monitors) {
            await onStartMonitorsUseCaseFactory().execute({ monitor, settings })
          }
        })().finally(resolve)
      }, 300)
    })
  }
}
