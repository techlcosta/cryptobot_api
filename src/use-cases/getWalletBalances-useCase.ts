
import { type Balances } from '@/client/binance-api/interfaces/spotAccount-interface'
import { type BinanceRestInterface } from '@/client/binance-api/rest/binanceRest-interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type CryptographyInterface } from '@/helpers/cryptography/cryptography-interface'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'

interface GetWalletBalancesUseCaseRequest {
  user_id: string
}

interface GetWalletBalancesUseCaseResponse {
  balances: Balances[]
}

export class GetWalletBalancesUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly binanceSpotRest: BinanceRestInterface,
    private readonly cryptography: CryptographyInterface
  ) {}

  async execute ({ user_id }: GetWalletBalancesUseCaseRequest): Promise<GetWalletBalancesUseCaseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!settings) throw new ResourceNotFoundError()

    const secretKey = this.cryptography.decrypt(settings.secretKey)

    const accountInfo = await this.binanceSpotRest.account({
      apiURL: settings.apiURL,
      apiKey: settings.apiKey,
      secretKey
    })

    return {
      balances: accountInfo.balances
    }
  }
}
