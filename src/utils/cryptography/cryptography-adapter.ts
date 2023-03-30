import { env } from '@/env'
import { createCipheriv, createDecipheriv } from 'crypto'
import { type CryptographyAdapterInterface } from './cryptography-adapter-interface'

export class CryptographyAdapter implements CryptographyAdapterInterface {
  private readonly algorithm = 'aes-256-cbc'
  private readonly key = env.CRYPTOGRAPHY_SECRET_KEY
  private readonly iv = env.CRYPTOGRAPHY_SECRET_IV
  encrypt (value: string): string {
    const cipher = createCipheriv(this.algorithm, this.key, this.iv)
    const encrypted = Buffer.from(cipher.update(value, 'utf8', 'hex') + cipher.final('hex')).toString('base64')

    return encrypted
  }

  decrypt (value: string): string {
    const buff = Buffer.from(value, 'base64')
    const decipher = createDecipheriv(this.algorithm, this.key, this.iv)
    const decrypted = (decipher.update(buff.toString('utf8'), 'hex', 'utf8') + decipher.final('utf8'))

    return decrypted
  }
}
