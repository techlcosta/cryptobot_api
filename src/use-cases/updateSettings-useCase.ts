import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Settings } from '@prisma/client'

interface UpdateSettingsUseCaseRequest {
  apiURL?: string
  streamURL?: string
  apiKey?: string
  secretKey?: string
  user_id: string
}

interface UpdateSettingsUseCaseResponse {
  settings: Settings
}

export class UpdateSettingsUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly cryptography: CryptographyInterface
  ) {}

  async execute ({ user_id, apiKey, secretKey, apiURL, streamURL }: UpdateSettingsUseCaseRequest): Promise<UpdateSettingsUseCaseResponse> {
    const currentSettings = await this.settingsRepository.findByUserId(user_id)

    if (!currentSettings) throw new ResourceNotFoundError()

    let secretKeyEncrypted: string | undefined

    if (secretKey !== undefined) secretKeyEncrypted = this.cryptography.encrypt(secretKey)

    const newSettings = await this.settingsRepository.update({
      user_id,
      apiKey,
      secretKey: secretKeyEncrypted,
      apiURL,
      streamURL
    })

    return {
      settings: newSettings
    }
  }
}
