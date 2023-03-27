
import { type EncryptAdapterInterface } from '@/adapters/encrypt'
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
import { type UsersRepositoryInterface } from '@/interfaces/users-repository'
import { type Settings } from '@prisma/client'

interface SaveSettingsUseCaseRequest {
  apiURL: string
  streamURL: string
  accessKey: string
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
    private readonly encryptAdapter: EncryptAdapterInterface
  ) {}

  async execute ({ apiURL, streamURL, accessKey, secretKey, user_id }: SaveSettingsUseCaseRequest): Promise<SaveSettingsUseCaseResponse> {
    const secretKeyEncrypted = this.encryptAdapter.encrypt(secretKey)

    const user = await this.usersRepository.findById(user_id)

    if (user === null) throw new InvalidCredentialsError()

    const settings = await this.settingsRepository.create({
      apiURL,
      streamURL,
      accessKey,
      secretKey: secretKeyEncrypted,
      user_id
    })

    return { settings }
  }
}
