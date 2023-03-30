import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  BINANCE_ACCESS_KEY: z.string(),
  BINANCE_SECRET_KEY: z.string(),
  CRYPTOGRAPHY_SECRET_IV: z.string().min(16),
  CRYPTOGRAPHY_SECRET_KEY: z.string().min(32),
  PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
