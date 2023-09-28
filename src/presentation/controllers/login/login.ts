import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../../protocols'

export class LoginController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badResquest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badResquest(new MissingParamError('password'))
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badResquest(new InvalidParamError('email'))
    }

    return { body: 'ok', statusCode: 200 }
  }
}
