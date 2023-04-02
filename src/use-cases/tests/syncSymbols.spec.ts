import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemorySettingsRepository } from '@/repositories/mock/settings-repository'
import { InMemorySymbolsRepository } from '@/repositories/mock/symbols-repository'
import { InMemoryUsersRepository } from '@/repositories/mock/users-repository'
import { exchangeInfo } from '@/services/binance-api/REST/SPOT/exchangeInfo/exchangeInfo'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { SyncSymbolsUseCase } from '../syncSymbols-useCase'

describe('Sync Symbols Use Case', () => {
  const name = 'Jhon Doe'
  const email = 'jhondoe@example.com'
  const password = '123456'

  const accessKey = 'api access key'
  const apiURL = 'https://testnet.binance.vision/api/'
  const secretKey = 'api secret key'
  const streamURL = 'stream api address URL'

  let usersRepository: InMemoryUsersRepository
  let settingsRepository: InMemorySettingsRepository
  let symbolsRepository: InMemorySymbolsRepository
  let sut: SyncSymbolsUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    settingsRepository = new InMemorySettingsRepository()
    symbolsRepository = new InMemorySymbolsRepository()
    sut = new SyncSymbolsUseCase(settingsRepository, symbolsRepository, exchangeInfo)
  })

  it('should be able to sync symbols', async () => {
    const { id } = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { user_id } = await settingsRepository.create({
      accessKey,
      apiURL,
      secretKey,
      streamURL,
      user_id: id
    })

    const { symbols } = await sut.execute({ user_id })

    console.log(symbols)

    expect(symbols.length > 1).toEqual(true)
  })

  it('should not be able to sync symbols with wrong user id or without registered settings', async () => {
    await expect(async () => await sut.execute({
      user_id: 'non-existing-id'
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
