import { MissingParamError } from '../../errors'
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

    this.emailValidator.isValid(httpRequest.body.email)

    return { body: 'ok', statusCode: 200 }
  }
}
