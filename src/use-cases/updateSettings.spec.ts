
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { CryptographyAdapter } from '@/utils/cryptography/cryptography-adapter'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateSettingsUseCase } from './updateSettings-useCase'

const user_id = randomUUID()
const accessKey = 'api access key'
const apiURL = 'api address URL'
const secretKey = 'api secret key'
const streamURL = 'stream api address URL'

let settingsRepository: InMemorySettingsRepository
let cryptographyAdapter: CryptographyAdapter
let sut: UpdateSettingsUseCase

describe('Save Settings Use Case', () => {
  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    cryptographyAdapter = new CryptographyAdapter()
    sut = new UpdateSettingsUseCase(settingsRepository, cryptographyAdapter)
  })

  it('should be able to update settings', async () => {
    const currentSettings = await settingsRepository.create({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id
    })

    const { settings } = await sut.execute({
      user_id: currentSettings.user_id,
      accessKey: `new ${accessKey}`,
      secretKey: `new ${secretKey}`,
      apiURL: `new ${apiURL}`,
      streamURL: `new ${streamURL}`
    })

    expect(settings.id).toEqual(expect.any(String))
    expect(settings.accessKey).not.toEqual(accessKey)
    expect(settings.secretKey).not.toEqual(secretKey)
    expect(settings.apiURL).not.toEqual(apiURL)
    expect(settings.streamURL).not.toEqual(streamURL)
  })

  it('should not be able to update settings with wrong user id', async () => {
    await expect(async () => {
      await sut.execute({
        accessKey,
        apiURL,
        secretKey,
        streamURL,
        user_id: 'non-existing-id'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
