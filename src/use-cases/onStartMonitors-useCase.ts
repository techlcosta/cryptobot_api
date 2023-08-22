import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type BinanceExchangeActionsInterface } from '@/helpers/binanceExchange/binanceExchangeActions-interface'
import { MonitorTypes, type MonitorsOut } from '@/repositories/interfaces/monitors-repository'
import { type Settings } from '@prisma/client'

interface OnStartMonitorUseCaseRequest {
  monitor: MonitorsOut
  settings: Settings
}

export class OnStartMonitorsUseCase {
  constructor (
    private readonly binanceExchangeActions: BinanceExchangeActionsInterface
  ) { }

  async execute ({ monitor, settings }: OnStartMonitorUseCaseRequest): Promise<void> {
    if (settings.user_id !== monitor.user_id) throw new ResourceNotFoundError()

    switch (monitor.type) {
      case MonitorTypes.chart:
        await this.binanceExchangeActions.startSpotCandlestick({
          apiURL: settings.apiURL,
          streamURL: settings.streamURL,
          indexes: monitor.indexes,
          interval: monitor.interval,
          symbol: monitor.symbol,
          user_id: monitor.user_id
        })
        break
      default:
        console.error(`${monitor.type}, type not found.`)
        break
    }
  }
}
