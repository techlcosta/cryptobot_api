export class BinanceError extends Error {
  constructor (public message: string) {
    super(message)
  }
}
