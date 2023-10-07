import { type AccountModel } from '../../../domain/models/AccountModel'
import {
  type AddAccount,
  type AddAccountModel
} from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import type { Validator } from '../../helpers/validations/validator'
import { type EmailValidator } from '../../protocols/email-validator'
import { SignUpController } from './signup'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStuby implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'id',
        name: 'any_name',
        email: 'valid@mail.com',
        password: 'any_password'
      }

      return await new Promise((resolve) => {
        resolve(fakeAccount)
      })
    }
  }

  return new AddAccountStuby()
}

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      throw new Error()
    }
  }

  return new EmailValidatorStub()
}

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    validate(input: any): Error {
      return null as any
    }
  }

  return new ValidatorStub()
}

interface SutTypes {
  sut: SignUpController
  sutError: SignUpController
  emailValidatorStub: EmailValidator
  validator: Validator
  addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const emailValidatorWithErrorStub = makeEmailValidatorWithError()
  const validator = makeValidator()
  const sut = new SignUpController(
    emailValidatorStub,
    addAccountStub,
    validator
  )
  const sutError = new SignUpController(
    emailValidatorWithErrorStub,
    addAccountStub,
    validator
  )

  return {
    addAccountStub,
    emailValidatorStub,
    sut,
    validator,
    sutError
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if passwordConfirmation is diferent than password', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(
      new InvalidParamError('passwordConfirmation').message
    )
  })

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toEqual(
      new InvalidParamError('email').message
    )
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('invalid_mail@mail.com')
  })

  test('Should return 500 if EmailValidator fails', async () => {
    const { sutError } = makeSut()

    const sut = sutError

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 500 if AddAccount fails', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => {
        reject(new Error())
      })
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const isValidSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_mail@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 200 if data provided is valid', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'id',
      name: 'any_name',
      email: 'valid@mail.com',
      password: 'any_password'
    })
  })

  test('Should Call Validator with correct values', async () => {
    const { sut, validator } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const spyValidator = jest.spyOn(validator, 'validate')

    await sut.handle(httpRequest)

    expect(spyValidator).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validator } = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'valid@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    jest
      .spyOn(validator, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      badResquest(new MissingParamError('any_field'))
    )
  })
})
