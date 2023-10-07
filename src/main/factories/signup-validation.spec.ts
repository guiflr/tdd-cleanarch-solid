import { RequiredValidationField } from '../../presentation/helpers/validations/required-validation-field'
import { ValidationComposite } from '../../presentation/helpers/validations/validation-composite'
import type { Validator } from '../../presentation/helpers/validations/validator'
import { makeSignupValidation } from './signup-validation'

jest.mock('../../presentation/helpers/validations/validation-composite')

describe('signup-validation', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignupValidation()

    const fields = ['name', 'email', 'password', 'passwordConfirmation']

    const validations: Validator[] = []

    for (const field of fields) {
      validations.push(new RequiredValidationField(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
