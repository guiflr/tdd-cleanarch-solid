import { mongoHelper } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  test('Should reconnect if mongo is down', async () => {
    const accounts = await mongoHelper.getCollection('accounts')

    expect(accounts).toBeDefined()

    await mongoHelper.disconnect()

    const users = await mongoHelper.getCollection('users')

    expect(users).toBeDefined()
  })
})
