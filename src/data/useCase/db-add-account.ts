import { type AccountModel } from '../../domain/models/AccountModel'
import {
  type AddAccount,
  type AddAccountModel
} from '../../domain/usecases/add-account'
import { type Encrypter } from '../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise((resolve) => {
      resolve({ ...account, id: 'id' })
    })
  }
}
