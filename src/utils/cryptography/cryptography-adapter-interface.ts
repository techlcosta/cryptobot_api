export interface CryptographyAdapterInterface {
  encrypt: (value: string) => string
  decrypt: (value: string) => string
}
