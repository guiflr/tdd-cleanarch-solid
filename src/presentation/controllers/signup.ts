import { MissingParamError } from '../errors/missing-param-error'
import { badResquest } from '../helpers/http-helper'
import { type Controller } from '../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../protocols/http'

export class SignUpController implements Controller {
  handle(httpRequest: HttpRequest): HttpResponse {
    const params = ['name', 'email', 'password', 'passwordConfirmation']

    for (const param of params) {
      if (!httpRequest.body[param]) {
        return badResquest(new MissingParamError(param))
      }
    }

    return { statusCode: 200, body: '' }
  }
}
