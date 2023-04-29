import bcrypt from 'bcrypt'

import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => {
      resolve('hashed')
    })
  }
}))

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('value')

    expect(hashSpy).toHaveBeenCalledWith('value', salt)
  })

  test('Should return a hashed value on success', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)

    const hashed = await sut.encrypt('value')

    expect(hashed).toBe('hashed')
  })
})
