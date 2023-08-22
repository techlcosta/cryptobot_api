
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { type BinanceExchangeActionsInterface } from '@/helpers/binanceExchange/binanceExchangeActions-interface'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type UsersRepositoryInterface } from '@/repositories/interfaces/users-repository'
import { type Settings } from '@prisma/client'

interface SaveSettingsUseCaseRequest {
  apiURL: string
  streamURL: string
  apiKey: string
  secretKey: string
  user_id: string
}

interface SaveSettingsUseCaseResponse {
  settings: Settings
}

export class SaveSettingsUseCase {
  constructor (
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly cryptography: CryptographyInterface,
    private readonly binanceExchangeActions: BinanceExchangeActionsInterface
  ) {}

  async execute ({ apiURL, streamURL, apiKey, secretKey, user_id }: SaveSettingsUseCaseRequest): Promise<SaveSettingsUseCaseResponse> {
    const secretKeyEncrypted = this.cryptography.encrypt(secretKey)

    const user = await this.usersRepository.findById(user_id)

    if (!user) throw new ResourceNotFoundError()

    const settingsAlredyExist = await this.settingsRepository.findByUserId(user_id)

    if (settingsAlredyExist) throw new SettingsAlredyExistsError()

    const settings = await this.settingsRepository.create({
      apiURL,
      streamURL,
      apiKey,
      secretKey: secretKeyEncrypted,
      user_id
    })

    await this.binanceExchangeActions.startSpotUserData({
      apiURL,
      streamURL,
      user_id,
      apiKey
    })

    return { settings }
  }
}
