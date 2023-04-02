
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { CryptographyAdapter } from '@/helpers/cryptography/cryptography-adapter'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/mock/users-repository'
import { SaveSettingsUseCase } from '../saveSettings-useCase'

describe('Save Settings Use Case', () => {
  const name = 'Jhon Doe'
  const email = 'jhondoe@example.com'
  const password = '123456'

  const accessKey = 'api access key'
  const apiURL = 'api address URL'
  const secretKey = 'api secret key'
  const streamURL = 'stream api address URL'
  let usersRepository: InMemoryUsersRepository
  let cryptographyAdapter: CryptographyAdapter
  let settingsRepository: InMemorySettingsRepository
  let sut: SaveSettingsUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    settingsRepository = new InMemorySettingsRepository()
    cryptographyAdapter = new CryptographyAdapter()
    sut = new SaveSettingsUseCase(usersRepository, settingsRepository, cryptographyAdapter)
  })

  it('should be able to save settings and encrypt secret key', async () => {
    const { id } = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { settings } = await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: id
    })

    console.log('decrypted value: ', secretKey)
    console.log('encrypted value: ', settings.secretKey)

    expect(settings.id).toEqual(expect.any(String))
    expect(settings.secretKey).not.toEqual(secretKey)
  })

  it('should not be able to save settings with wrong user id', async () => {
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

  it('should not be able to save settings if settings alredy exists', async () => {
    const { id } = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { settings } = await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: id
    })

    await expect(async () => await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: settings.user_id
    })).rejects.toBeInstanceOf(SettingsAlredyExistsError)
  })
})
