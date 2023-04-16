import {
  type AddAccount,
  type Controller,
  type EmailValidator,
  type HttpRequest,
  type HttpResponse
} from './signup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badResquest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
