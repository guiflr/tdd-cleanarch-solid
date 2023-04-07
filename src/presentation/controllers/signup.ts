import { InvalidParamError, MissingParamError } from '../errors'
import { badResquest, serverError } from '../helpers/http-helper'
import {
  type Controller,
  type EmailValidator,
  type HttpRequest,
  type HttpResponse
} from '../protocols'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const params = ['name', 'email', 'password', 'passwordConfirmation']

      for (const param of params) {
        if (!httpRequest.body[param]) {
          return badResquest(new MissingParamError(param))
        }
      }

      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badResquest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!emailIsValid) {
        return badResquest(new InvalidParamError('email'))
      }

      return { statusCode: 200, body: '' }
    } catch (error) {
      return serverError()
    }
  }
}
