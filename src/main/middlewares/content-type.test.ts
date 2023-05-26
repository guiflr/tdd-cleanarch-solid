import supertest from 'supertest'
import app from '../config/app'

describe('Cors Middlware', () => {
  test('Should parse body as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })

    await supertest(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should parse body as json', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.contentType('xml')
      res.send('')
    })

    await supertest(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
