import type { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import {
  badResquest,
  ok,
  serverError,
  unauthorized
} from '../../helpers/http-helper'
import type {
  Controller,
  EmailValidator,
  HttpRequest,
  HttpResponse
} from '../../protocols'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      const token = await this.authentication.auth(email, password)

      if (!token) {
        return unauthorized()
      }

      return ok({ accessToken: token })
    } catch (err) {
      const error = err as Error
      return serverError(error)
    }
  }
}
