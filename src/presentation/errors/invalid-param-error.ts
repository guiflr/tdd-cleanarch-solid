export class InvalidParamError extends Error {
  constructor(error: string) {
    super(`Invalid param: ${error}`)
    this.name = 'InvalidParamError'
  }
}
