import supertest from 'supertest'
import app from '../config/app'

describe('Cors Middlware', () => {
  test('Should return an account on success', async () => {
    await supertest(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme',
        email: 'gui@gmail.com',
        password: '36639821',
        confirmPassword: '36639821'
      })
      .expect(200)
  })
})
