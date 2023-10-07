import { DbAddAccount } from '../../data/useCase/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account.'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import type { Validator } from '../../presentation/helpers/validations/validator'
import type { Controller } from '../../presentation/protocols'
import { EmailValidorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const salt = 12

  const emailValidator = new EmailValidorAdapter()
  const bcrypt = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypt, accountMongoRepository)

  class ValidatorTest implements Validator {
    validate(input: any): Error {
      return new Error('Method not implemented.')
    }
  }

  const signUpController = new SignUpController(
    emailValidator,
    dbAddAccount,
    new ValidatorTest()
  )

  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logRepository)
}
