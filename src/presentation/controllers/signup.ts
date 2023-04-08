import { type AddAccount } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { badResquest, serverError } from '../helpers/http-helper'
import {
  type Controller,
  type EmailValidator,
  type HttpRequest,
  type HttpResponse
} from '../protocols'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const params = ['name', 'email', 'password', 'passwordConfirmation']

      for (const param of params) {
        if (!httpRequest.body[param]) {
          return badResquest(new MissingParamError(param))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badResquest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badResquest(new InvalidParamError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      return { statusCode: 200, body: '' }
    } catch (error) {
      return serverError()
    }
  }
}
