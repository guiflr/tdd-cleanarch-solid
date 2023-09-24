import type { Collection } from 'mongodb'
import { mongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('LogRepository', () => {
  let collection: Collection

  beforeAll(async () => {
    await mongoHelper.connect()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
    await mongoHelper.disconnectMongoMemory()
  })

  beforeEach(async () => {
    collection = await mongoHelper.getCollection('errors')

    await collection.deleteMany({})
  })

  test('Should create an error log', async () => {
    const logRepo = new LogMongoRepository()

    await logRepo.log('stack_error')

    const count = await collection.countDocuments()

    expect(count).toBe(1)
  })
})
