export default class DuplicatedUniqueError extends Error {
  constructor (paramName: string) {
    super(`Unique param duplicated: ${paramName}`)
    this.name = 'DuplicatedUniqueError'
  }
}
