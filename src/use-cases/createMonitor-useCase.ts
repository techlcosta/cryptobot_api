import { MonitorAlredyExistsError } from '@/errors/monitor-alredy-exists-error'
import { SettingsNotFoundError } from '@/errors/settings-not-found-error'
import { type MonitorsOut, type MonitorsRepositoryInterface } from '@/repositories/interfaces/monitors-repository'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { onStartMonitorsUseCaseFactory } from './factories/factory-onStartMonitors-useCase'

interface CreateMonitorUseCaseRequest {
  symbol: string
  type: string
  interval: string
  is_active: boolean
  user_id: string
  indexes: Array<{
    type: string
    params: string
  }>
}

interface CreateMonitorUseCaseResponse {
  monitor: MonitorsOut
}

export class CreateMonitorUseCase {
  constructor (
    private readonly monitorsRepository: MonitorsRepositoryInterface,
    private readonly settingsRepository: SettingsRepositoryInterface
  ) {}

  async execute ({ user_id, symbol, type, indexes, interval, is_active }: CreateMonitorUseCaseRequest): Promise<CreateMonitorUseCaseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!settings) throw new SettingsNotFoundError()

    if (await this.monitorsRepository.findByUserIdAndSymbolAndInterval({ user_id, symbol, interval })) throw new MonitorAlredyExistsError()

    const monitor = await this.monitorsRepository.create({
      user_id,
      symbol,
      type,
      interval,
      is_active,
      is_system_monitor: false,
      indexes
    })

    if (monitor.is_active) await onStartMonitorsUseCaseFactory().execute({ monitor, settings })

    return { monitor }
  }
}
