import { RequiredValidationField } from '../../presentation/helpers/validations/required-validation-field'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import type { Validator } from '../../presentation/helpers/validations/validator'

export const makeSignupValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']

  const validations: Validator[] = []

  for (const field of fields) {
    validations.push(new RequiredValidationField(field))
  }

  return new ValidationComposite(validations)
}
