export class AutomationAlredyExistsError extends Error {
  constructor () {
    super('automation alredy exists.')
  }
}
