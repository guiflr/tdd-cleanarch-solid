import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest, serverError } from '../../helpers/http-helper'
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

  test('Should return 400 if email provided is invalid', async () => {
    const httpRequest = {
      body: {
        email: 'email@rmail.com',
        password: 'password'
      }
    }

    jest
      .spyOn(emailValidatorTest, 'isValid')
      .mockImplementationOnce(() => false)

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(badResquest(new InvalidParamError('email')))
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const httpRequest = {
      body: {
        email: 'email@rmail.com',
        password: 'password'
      }
    }

    jest.spyOn(emailValidatorTest, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })
})
