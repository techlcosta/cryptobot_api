import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type SettingsRepositoryInterface } from '@/interfaces/settings-repository'
import { type CryptographyAdapterInterface } from '@/utils/cryptography/cryptography-adapter-interface'
import { type Settings } from '@prisma/client'

interface GetSettingsUseCaseRequest {
  user_id: string
}

interface GetSettingsUseCaseResponse {
  settings: Settings
}

export class GetSettingsUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly cryptographyAdapter: CryptographyAdapterInterface
  ) {}

  async execute ({ user_id }: GetSettingsUseCaseRequest): Promise<GetSettingsUseCaseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (settings === null) throw new ResourceNotFoundError()

    settings.secretKey = this.cryptographyAdapter.decrypt(settings.secretKey)

    return {
      settings
    }
  }
}
