export class MissingParamError extends Error {
  constructor(error: string) {
    super(`Missing param: ${error}`)
    this.name = 'MissingParamError'
  }
}
