import { EMA, RSI, SMA } from 'technicalindicators'
import { z } from 'zod'
import { type EMAInput, type EMAOut, type IndicatorsAdapterInterface, type RSIInput, type RSIOut } from './indicators-adapter-interface'

export class IndicatorsAdapter implements IndicatorsAdapterInterface {
  async rsi (data: RSIInput): Promise<RSIOut> {
    const RSIInputSchema = z.object({
      params: z.string().nonempty().regex(/^\d+$/).transform(value => Number(value)),
      values: z.array(z.number()).nonempty(),
      reversedInput: z.boolean().optional(),
      format: z.function().args(z.number()).returns(z.number()).optional()
    })

    const { params: period, values, reversedInput, format } = RSIInputSchema.parse(data)

    const result = RSI.calculate({ period, values, reversedInput, format })

    return {
      last: result[result.length - 1],
      prevent: result[result.length - 2]
    }
  }

  async ema (data: EMAInput): Promise<EMAOut> {
    const EMAInputSchema = z.object({
      params: z.string().nonempty().regex(/^\d+$/).transform(value => Number(value)),
      values: z.array(z.number()).nonempty(),
      reversedInput: z.boolean().optional(),
      format: z.function().args(z.number()).returns(z.number()).optional()
    })

    const { params: period, values, reversedInput, format } = EMAInputSchema.parse(data)

    const result = EMA.calculate({ period, values, reversedInput, format })

    return {
      last: result[result.length - 1],
      prevent: result[result.length - 2]
    }
  }

  async sma (data: EMAInput): Promise<EMAOut> {
    const SMAInputSchema = z.object({
      params: z.string().nonempty().regex(/^\d+$/).transform(value => Number(value)),
      values: z.array(z.number()).nonempty(),
      reversedInput: z.boolean().optional(),
      format: z.function().args(z.number()).returns(z.number()).optional()
    })

    const { params: period, values, reversedInput, format } = SMAInputSchema.parse(data)

    const result = SMA.calculate({ period, values, reversedInput, format })

    return {
      last: result[result.length - 1],
      prevent: result[result.length - 2]
    }
  }
}
