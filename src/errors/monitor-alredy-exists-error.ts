export class MonitorAlredyExistsError extends Error {
  constructor () {
    super('monitor alredy exists.')
  }
}
