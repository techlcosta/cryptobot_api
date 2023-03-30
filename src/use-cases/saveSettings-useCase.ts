
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
import { type UsersRepositoryInterface } from '@/interfaces/users-repository'
import { type CryptographyAdapterInterface } from '@/utils/cryptography/cryptography-adapter-interface'
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
    private readonly cryptographyAdapter: CryptographyAdapterInterface
  ) {}

  async execute ({ apiURL, streamURL, accessKey, secretKey, user_id }: SaveSettingsUseCaseRequest): Promise<SaveSettingsUseCaseResponse> {
    const secretKeyEncrypted = this.cryptographyAdapter.encrypt(secretKey)

    const user = await this.usersRepository.findById(user_id)

    if (user === null) throw new ResourceNotFoundError()

    const hasSttings = await this.settingsRepository.findByUserId(user_id)

    if (hasSttings !== null) throw new SettingsAlredyExistsError()

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
