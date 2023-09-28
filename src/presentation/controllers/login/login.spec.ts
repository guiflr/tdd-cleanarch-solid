import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { LoginController } from './login'

describe('Login controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const loginController = new LoginController()

    const httpRequest = {
      body: {
        password: 'password'
      }
    }

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(badResquest(new MissingParamError('email')))
  })
})
