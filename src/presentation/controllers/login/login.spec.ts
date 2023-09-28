import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import { LoginController } from './login'

describe('Login controller', () => {
  const loginController = new LoginController()
  test('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        password: 'password'
      }
    }

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(badResquest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const httpRequest = {
      body: {
        email: 'email@rmail.com'
      }
    }

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(badResquest(new MissingParamError('password')))
  })
})
