import MongoHelper from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account.'

describe('teste', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')

    await collection.deleteMany({})
  })

  test('...', async () => {
    const data = {
      name: 'guilherme',
      email: 'guuilherme@gui.com.br',
      password: 'guilherme'
    }

    const accountMongoRepository = new AccountMongoRepository()

    const account = await accountMongoRepository.add({ ...data })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(data.name)
    expect(account.email).toBe(data.email)
    expect(account.password).toBe(data.password)
  })
})
