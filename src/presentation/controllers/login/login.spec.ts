import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import type { EmailValidator } from '../../protocols'
import { LoginController } from './login'

describe('Login controller', () => {
  class EmailValidatorTest implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  const emailValidatorTest = new EmailValidatorTest()

  const loginController = new LoginController(emailValidatorTest)
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

  test('Should call with correct email', async () => {
    const httpRequest = {
      body: {
        email: 'email@rmail.com',
        password: 'password'
      }
    }

    const spyEmailValidatorTest = jest.spyOn(emailValidatorTest, 'isValid')

    await loginController.handle(httpRequest)

    expect(spyEmailValidatorTest).toHaveBeenCalledWith(httpRequest.body.email)
  })
})
