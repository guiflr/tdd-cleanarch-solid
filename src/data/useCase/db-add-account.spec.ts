import { DbAddAccount } from './db-add-account'
import { type Encrypter } from '../protocols/encrypter'
import { type AccountModel } from '../../domain/models/AccountModel'
import { type AddAccountModel } from '../../domain/usecases/add-account'
import { type AddAccountRepository } from '../protocols/add-account-repository'
interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
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
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return { encrypterStub, sut, addAccountRepositoryStub }
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeaccount = {
        id: 'id',
        name: 'name',
        email: 'email@email.com',
        password: 'hashed_password'
      }
      return await new Promise((resolve) => {
        resolve(fakeaccount)
      })
    }
  }

  return new AddAccountRepositoryStub()
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

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const account = {
      name: 'name',
      email: 'email@email.com',
      password: 'hashed_password'
    }

    await sut.add(account)

    expect(addAccountSpy).toHaveBeenCalledWith(account)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValue(
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

  test('Should create Account', async () => {
    const { sut } = makeSut()

    const accountData = {
      name: 'name',
      email: 'email@email.com',
      password: 'password'
    }

    const account = await sut.add(accountData)

    expect(account).toEqual({
      id: 'id',
      name: 'name',
      email: 'email@email.com',
      password: 'hashed_password'
    })
  })
})
