import { DbAddAccount } from '../../data/useCase/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account.'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidorAdapter } from '../../utils/email-validator-adapter'

export const makeSignUpController = (): SignUpController => {
  const salt = 12

  const emailValidator = new EmailValidorAdapter()
  const bcrypt = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcrypt, accountMongoRepository)

  return new SignUpController(emailValidator, dbAddAccount)
}
