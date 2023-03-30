export class SettingsAlredyExistsError extends Error {
  constructor () {
    super('Settings alredy exists.')
  }
}
