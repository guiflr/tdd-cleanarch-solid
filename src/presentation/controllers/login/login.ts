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
    const { email, password } = httpRequest.body

    if (!email) {
      return badResquest(new MissingParamError('email'))
    }

    if (!password) {
      return badResquest(new MissingParamError('password'))
    }

    const isValid = this.emailValidator.isValid(email)

    if (!isValid) {
      return badResquest(new InvalidParamError('email'))
    }

    return { body: 'ok', statusCode: 200 }
  }
}
