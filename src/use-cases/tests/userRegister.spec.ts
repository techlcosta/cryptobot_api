import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserAlredyExistsError } from '../../errors/user-alredy-exists-error'
import { InMemoryUsersRepository } from '../../repositories/mock/users-repository'
import { UserRegisterUseCase } from '../userRegister-useCase'

describe('User Register Use Case', () => {
  const name = 'Jhon Doe'
  const email = 'jhondoe@example.com'
  const password = '123456'

  let usersRepository: InMemoryUsersRepository
  let sut: UserRegisterUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UserRegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name,
      email,
      password
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name,
      email,
      password
    })

    const isPasswordCorrectlyHashed = await compare(password, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      name,
      email,
      password
    })

    await expect(async () => await sut.execute({
      name,
      email,
      password
    })).rejects.toBeInstanceOf(UserAlredyExistsError)
  })
})
