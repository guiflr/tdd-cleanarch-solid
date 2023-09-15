import { mongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account.'

describe('teste', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
    await mongoHelper.disconnectMongoMemory()
  })

  beforeEach(async () => {
    await mongoHelper.connect()
    const collection = await mongoHelper.getCollection('accounts')

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
