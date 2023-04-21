import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../protocols/encrypter'
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => {
        resolve('hashed_password')
      })
    }
  }

  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return { encrypterStub, sut }
}

describe('DBAddUserAccount', () => {
  test('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const account = {
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    }

    await sut.add(account)

    expect(encryptSpy).toHaveBeenCalledWith(account.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { encrypterStub, sut } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValue(
      new Promise((resolve, reject) => {
        reject(new Error())
      })
    )

    const account = {
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    }

    const promise = sut.add(account)

    await expect(promise).rejects.toThrow()
  })
})
