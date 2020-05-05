export default class MissingParamError extends Error {
  constructor (paramNames: string[]) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    super(`Missing params:${paramNames.map(item => ` ${item}`)}`)
    this.name = 'MissingParamError'
  }
}
