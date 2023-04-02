import { InvalidCredentialsError } from '@/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/mock/users-repository'
import { UserAuthenticateUseCase } from '../userAuthenticate-useCase'

describe('User Authenticate Use Case', () => {
  const name = 'Jhon Doe'
  const email = 'jhondoe@example.com'
  const password = '123456'

  let usersRepository: InMemoryUsersRepository
  let sut: UserAuthenticateUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserAuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { user } = await sut.execute({
      email,
      password
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(async () => {
      await sut.execute({
        email,
        password
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    await expect(async () => {
      await sut.execute({
        email,
        password: '123123'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
