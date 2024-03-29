import { type SymbolLotSizeFilter, type SymbolMinNotionalFilter } from '@/client/binance-api/interfaces/spotExchangeInfo-interface'
import { type BinanceRestInterface } from '@/client/binance-api/rest/binanceRest-interface'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { type SettingsRepositoryInterface } from '@/repositories/interfaces/settings-repository'
import { type SymbolsRepositoryInterface } from '@/repositories/interfaces/symbols-repository'
import { type Symbols } from '@prisma/client'

interface SyncSymbolsUseCaseRequest {
  user_id: string
}

interface SyncSymbolsUseCaseResponse {
  symbols: Symbols[]
}

export class SyncSymbolsUseCase {
  constructor (
    private readonly settingsRepository: SettingsRepositoryInterface,
    private readonly symbolsRepository: SymbolsRepositoryInterface,
    private readonly binanceSpotApi: BinanceRestInterface
  ) {}

  async execute ({ user_id }: SyncSymbolsUseCaseRequest): Promise<SyncSymbolsUseCaseResponse> {
    const settings = await this.settingsRepository.findByUserId(user_id)

    if (!settings) throw new ResourceNotFoundError()

    const exchangeInfo = await this.binanceSpotApi.exchangeInfo({ apiURL: settings.apiURL })

    for (const item of exchangeInfo.symbols) {
      let min_lot_size = '0'
      let min_notional = '0'

      for (const filter of item.filters) {
        if (filter.filterType === 'LOT_SIZE') min_lot_size = (filter as SymbolLotSizeFilter).minQty

        if (filter.filterType === 'MIN_NOTIONAL') min_notional = (filter as SymbolMinNotionalFilter).minNotional
      }

      const symbol = await this.symbolsRepository.findByUserIdAndSymbol({ symbol: item.symbol, user_id })

      if (!symbol) {
        await this.symbolsRepository.create({
          user_id,
          min_notional,
          min_lot_size,
          is_favorite: false,
          symbol: item.symbol,
          base: item.baseAsset,
          quote: item.quoteAsset,
          base_precision: item.baseAssetPrecision,
          quote_precision: item.quoteAssetPrecision
        })
      } else {
        await this.symbolsRepository.update({
          id: symbol.id,
          min_notional,
          min_lot_size,
          base: item.baseAsset,
          quote: item.quoteAsset,
          base_precision: item.baseAssetPrecision,
          quote_precision: item.quoteAssetPrecision
        })
      }
    }

    const symbols = await this.symbolsRepository.findByUserId(user_id)

    return {
      symbols
    }
  }
}
