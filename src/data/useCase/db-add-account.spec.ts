import { DbAddAccount } from './db-add-account'

describe('DBAddUserAccount', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt(value: string): Promise<string> {
        return await new Promise((resolve) => {
          resolve('hashed_password')
        })
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account = {
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith(account.password)
  })
})
