export class MissingParamError extends Error {
  constructor(error: string) {
    super(error)
    this.name = 'MissingParamError'
  }
}
