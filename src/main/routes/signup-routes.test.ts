import supertest from 'supertest'
import app from '../config/app'
import MongoHelper from '../../infra/db/mongodb/helpers/mongo-helper'

describe('Cors Middlware', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')

    await collection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme',
        email: 'gui@gmail.com',
        password: '36639821',
        passwordConfirmation: '36639821'
      })
      .expect(200)
  })
})
