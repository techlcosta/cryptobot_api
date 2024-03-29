import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
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
    private readonly cryptography: CryptographyInterface
  ) {}

  async execute ({ user_id }: GetSettingsUseCaseRequest): Promise<GetSettingsUseCaseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!settings) throw new ResourceNotFoundError()

    settings.secretKey = this.cryptography.decrypt(settings.secretKey)

    return {
      settings
    }
  }
}
