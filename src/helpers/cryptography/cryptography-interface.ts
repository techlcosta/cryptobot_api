export interface CryptographyInterface {
  encrypt: (value: string) => string
  decrypt: (value: string) => string
}
