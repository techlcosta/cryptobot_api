export class BinanceRequestError extends Error {
  constructor (public message: string) {
    super(message)
  }
}
