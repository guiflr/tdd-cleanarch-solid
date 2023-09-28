import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return badResquest(new MissingParamError('email'))
    }

    if (!httpRequest.body.password) {
      return badResquest(new MissingParamError('password'))
    }

    return { body: 'ok', statusCode: 200 }
  }
}
