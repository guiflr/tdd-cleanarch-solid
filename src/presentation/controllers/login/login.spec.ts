import type { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import {
  badResquest,
  serverError,
  unauthorized
} from '../../helpers/http-helper'
import type { EmailValidator } from '../../protocols'
import { LoginController } from './login'

describe('Login controller', () => {
  class EmailValidatorTest implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  class AuthenticationTest implements Authentication {
    async auth(email: string, password: string): Promise<string> {
      return 'token'
    }
  }

  const authentication = new AuthenticationTest()

  const emailValidatorTest = new EmailValidatorTest()

  const loginController = new LoginController(
    emailValidatorTest,
    authentication
  )
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

  test('Should call Authentication', async () => {
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password'
      }
    }

    const spyAuthentication = jest.spyOn(authentication, 'auth')

    await loginController.handle(httpRequest)

    expect(spyAuthentication).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    )
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const httpRequest = {
      body: {
        email: 'email@email.com',
        password: 'password'
      }
    }

    jest
      .spyOn(authentication, 'auth')
      .mockImplementationOnce(async () => null as any)

    const repsonse = await loginController.handle(httpRequest)

    expect(repsonse).toEqual(unauthorized())
  })

  test('Should return 500 if Authencation throws', async () => {
    const httpRequest = {
      body: {
        email: 'email@rmail.com',
        password: 'password'
      }
    }
    jest.spyOn(authentication, 'auth').mockImplementationOnce(async () => {
      throw new Error()
    })

    const response = await loginController.handle(httpRequest)

    expect(response).toEqual(serverError(new Error()))
  })
})
