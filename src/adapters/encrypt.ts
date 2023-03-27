/* eslint-disable new-cap */
import { env } from '@/env'
import { AES } from '@/lib/aes-js'

export interface EncryptAdapterInterface {
  encrypt: (value: string) => string
}

export class EncryptAdapter implements EncryptAdapterInterface {
  private readonly key = AES.utils.utf8.toBytes(env.AES_KEY)

  encrypt (value: string): string {
    const toBytes = AES.utils.utf8.toBytes(value)
    const CTR = new AES.ModeOfOperation.ctr(this.key)
    const encryptedBytes = CTR.encrypt(toBytes)
    const toHEX = AES.utils.hex.fromBytes(encryptedBytes)

    return toHEX
  }
}
