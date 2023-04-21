import { type EmailValidator } from '../presentation/protocols'
import validator from 'validator'

export class EmailValidorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const isEmail = validator.isEmail(email)

    return isEmail
  }
}
