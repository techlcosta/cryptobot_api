import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { Cryptography } from '@/helpers/cryptography/cryptography'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { randomUUID } from 'crypto'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetSettingsUseCase } from '../getSettings-useCase'

describe('Get Settings Use Case', () => {
  const user_id = randomUUID()
  const apiKey = 'api access key'
  const apiURL = 'api address URL'
  const secretKey = 'api secret key'
  const streamURL = 'stream api address URL'

  let settingsRepository: InMemorySettingsRepository
  let cryptography: Cryptography
  let sut: GetSettingsUseCase

  beforeEach(() => {
    settingsRepository = new InMemorySettingsRepository()
    cryptography = new Cryptography()
    sut = new GetSettingsUseCase(settingsRepository, cryptography)
  })

  it('should be able to get settings and decrypt secret key', async () => {
    const encrypted = cryptography.encrypt(secretKey)

    const currentSettings = await settingsRepository.create({
      apiKey,
      apiURL,
      secretKey: encrypted,
      streamURL,
      user_id
    })

    console.log('encrypted value: ', currentSettings.secretKey)

    const { settings } = await sut.execute({ user_id: currentSettings.user_id })

    console.log('decrypted value: ', settings.secretKey)

    expect(settings.id).toEqual(expect.any(String))
    expect(settings.secretKey).toEqual(secretKey)
  })

  it('should not be able to get settings with wrong user id', async () => {
    await expect(async () => {
      await sut.execute({ user_id: 'non-existing-id' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
