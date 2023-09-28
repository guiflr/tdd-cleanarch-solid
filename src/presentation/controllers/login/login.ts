import { MissingParamError } from '../../errors'
import { badResquest } from '../../helpers/http-helper'
import type { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    return badResquest(new MissingParamError('email'))
  }
}
