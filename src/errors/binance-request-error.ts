export class BianceRequestError extends Error {
  constructor (public message: string) {
    super(message)
  }
}
