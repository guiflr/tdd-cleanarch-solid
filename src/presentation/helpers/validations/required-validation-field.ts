import { MissingParamError } from '../../errors'
import type { Validator } from './validator'

export class RequiredValidationField implements Validator {
  constructor(private readonly fieldName: string) {
    this.fieldName = fieldName
  }

  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }

    return null as any
  }
}
