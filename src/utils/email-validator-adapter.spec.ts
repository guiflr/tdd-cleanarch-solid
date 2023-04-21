import { EmailValidorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('Email Validator Adapter', () => {
  test('Should return false if email is invalid', () => {
    const sut = new EmailValidorAdapter()
    jest.spyOn(validator, 'isEmail').mockImplementationOnce(() => false)
    const isValid = sut.isValid('email@email')

    expect(isValid).toBe(false)
  })

  test('Should return true if email is valid', () => {
    const sut = new EmailValidorAdapter()

    const isValid = sut.isValid('email@email.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = new EmailValidorAdapter()
    const spy = jest
      .spyOn(validator, 'isEmail')
      .mockImplementationOnce(() => false)

    sut.isValid('email@email.com')

    expect(spy).toHaveBeenCalledWith('email@email.com')
  })
})
