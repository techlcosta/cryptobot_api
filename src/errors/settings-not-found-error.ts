export class SettingsNotFoundError extends Error {
  constructor () {
    super('Settings not found.')
  }
}
