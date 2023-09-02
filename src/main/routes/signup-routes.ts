import { type Router } from 'express'
import { adaptRoute } from '../adapters/express-adapter'
import { makeSignUpController } from '../factories/signup'

export default (route: Router): void => {
  route.post('/signup', adaptRoute(makeSignUpController()))
}
