
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { randomUUID } from 'node:crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateSettingsUseCase } from '../updateSettings-useCase'

describe('Updatye Settings Use Case', () => {
  const user_id = randomUUID()
  const apiKey = 'api access key'
  const apiURL = 'api address URL'
  const secretKey = 'api secret key'
  const streamURL = 'stream api address URL'

  let settingsRepository: InMemorySettingsRepository
  let cryptography: Cryptography
  let sut: UpdateSettingsUseCase

  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    cryptography = new Cryptography()
    sut = new UpdateSettingsUseCase(settingsRepository, cryptography)
  })

  it('should be able to update settings', async () => {
    const encrypted = cryptography.encrypt(secretKey)

    const currentSettings = await settingsRepository.create({
      apiKey,
      apiURL,
      secretKey: encrypted,
      streamURL,
      user_id
    })

    console.log(currentSettings)

    const { settings } = await sut.execute({
      user_id: currentSettings.user_id,
      apiKey: `new ${apiKey}`,
      secretKey: `new ${secretKey}`,
      apiURL: `new ${apiURL}`,
      streamURL: `new ${streamURL}`
    })

    console.log(settings)

    expect(settings.id).toEqual(expect.any(String))
    expect(settings.apiKey).not.toEqual(apiKey)
    expect(settings.secretKey).not.toEqual(secretKey)
    expect(settings.apiURL).not.toEqual(apiURL)
    expect(settings.streamURL).not.toEqual(streamURL)
  })

  it('should not be able to update settings with wrong user id', async () => {
    await expect(async () => {
      await sut.execute({
        apiKey,
        apiURL,
        secretKey,
        streamURL,
        user_id: 'non-existing-id'
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
