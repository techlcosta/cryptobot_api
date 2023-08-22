
import { BinanceExchangeActions } from '@/helpers/binanceExchange/binanceExchangeActions'
import { OnStartMonitorsUseCase } from '../onStartMonitors-useCase'

export function onStartMonitorsUseCaseFactory (): OnStartMonitorsUseCase {
  const binanceExchangeActions = new BinanceExchangeActions()

  const startMonitorUseCase = new OnStartMonitorsUseCase(binanceExchangeActions)

  return startMonitorUseCase
}
