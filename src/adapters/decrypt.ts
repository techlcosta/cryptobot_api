/* eslint-disable new-cap */
import { env } from '@/env'
import { AES } from '@/lib/aes-js'

export interface DecryptAdapterInterface {
  decrypt: (value: string) => string
}

export class DecryptAdapter implements DecryptAdapterInterface {
  private readonly key = AES.utils.utf8.toBytes(env.AES_KEY)

  decrypt (value: string): string {
    const toBytes = AES.utils.hex.toBytes(value)
    const CTR = new AES.ModeOfOperation.ctr(this.key)
    const encryptedBytes = CTR.decrypt(toBytes)
    const toUTF8 = AES.utils.utf8.fromBytes(encryptedBytes)

    return toUTF8
  }
}
