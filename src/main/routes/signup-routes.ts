import { type Express } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeSignUpController } from '../factories/signup'

export default (app: Express): void => {
  app.post('/api/signup', adaptRoute(makeSignUpController()))
}
