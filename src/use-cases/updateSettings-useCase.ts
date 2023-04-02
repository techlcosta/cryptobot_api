import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyAdapterInterface } from '@/helpers/cryptography/cryptography-adapter-interface'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type Settings } from '@prisma/client'

interface UpdateSettingsUseCaseRequest {
  apiURL?: string
  streamURL?: string
  accessKey?: string
  secretKey?: string
  user_id: string
}

interface UpdateSettingsUseCaseResponse {
  settings: Settings
}

export class UpdateSettingsUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly cryptographyAdapter: CryptographyAdapterInterface
  ) {}

  async execute ({ user_id, accessKey, secretKey, apiURL, streamURL }: UpdateSettingsUseCaseRequest): Promise<UpdateSettingsUseCaseResponse> {
    const currentSettings = await this.settingsRepository.findByUserId(user_id)

    if (currentSettings === null) throw new ResourceNotFoundError()

    let secretKeyEncrypted: string | undefined

    if (secretKey !== undefined) secretKeyEncrypted = this.cryptographyAdapter.encrypt(secretKey)

    const newSettings = await this.settingsRepository.update({
      user_id: currentSettings.user_id,
      accessKey,
      secretKey: secretKeyEncrypted,
      apiURL,
      streamURL
    })

    return {
      settings: newSettings
    }
  }
}
