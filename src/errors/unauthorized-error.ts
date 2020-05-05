export default class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.message = 'Token not provided'
  }
}
