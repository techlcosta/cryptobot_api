
interface IndicatorInput {
  reversedInput?: boolean
  format?: (data: number) => number
}

export interface RSIInput extends IndicatorInput {
  params: string
  values: number[]
}

export interface RSIOut {
  last: number
  prevent: number
}

export interface EMAInput extends IndicatorInput {
  params: string
  values: number[]
}

export interface EMAOut {
  last: number
  prevent: number
}

export interface SMAInput extends IndicatorInput {
  params: string
  values: number[]
}

export interface SMAOut {
  last: number
  prevent: number
}

export interface IndicatorsAdapterInterface {
  rsi: (data: RSIInput) => Promise<RSIOut>
  ema: (data: EMAInput) => Promise<EMAOut>
  sma: (data: SMAInput) => Promise<SMAOut>
}
