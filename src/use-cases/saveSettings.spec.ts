
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { SettingsAlredyExistsError } from '@/errors/settings-alredy-exists-error'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { CryptographyAdapter } from '@/utils/cryptography/cryptography-adapter'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/mock/users-repository'
import { SaveSettingsUseCase } from './saveSettings-useCase'

const name = 'Jhon Doe'
const email = 'jhondoe@example.com'
const password = '123456'

const accessKey = 'apiAccessKey'
const apiURL = 'apiAddressURL'
const secretKey = 'apiSecretKey'
const streamURL = 'streamApiAddressURL'

let usersRepository: InMemoryUsersRepository
let settingsRepository: InMemorySettingsRepository
let cryptographyAdapter: CryptographyAdapter
let sut: SaveSettingsUseCase

describe('Save Settings Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    settingsRepository = new InMemorySettingsRepository()
    cryptographyAdapter = new CryptographyAdapter()
    sut = new SaveSettingsUseCase(usersRepository, settingsRepository, cryptographyAdapter)
  })

  it('should be able to save settings', async () => {
    const user = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { settings } = await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: user.id
    })

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
    const user = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: user.id
    })

    await expect(async () => await sut.execute({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: user.id
    })).rejects.toBeInstanceOf(SettingsAlredyExistsError)
  })
})
