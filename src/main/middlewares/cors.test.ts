import supertest from 'supertest'
import app from '../config/app'

describe('Cors Middlware', () => {
  test('Should parse body as json', async () => {
    app.post('/cors', (req, res) => {
      res.send(req.body)
    })

    await supertest(app)
      .get('/cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
