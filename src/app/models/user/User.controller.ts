import IHttpResponse from '../../../helpers/IHttpResponse'
import httpResponse from '../../../helpers/HttpResponse'
import UserModel from './User.model'
import IBaseModelType from './User'
import { verifyMissingParams } from '../../../helpers/verify-missing-params'
import {
  MissingParamError,
  InvalidParamError,
  DuplicatedUniqueError
} from '../../../errors'
import BaseRepository from '../../bases/BaseRepository/BaseRepository'
import validator from 'validator'
import BaseController from '../../bases/BaseController/BaseController'
import IHttpRequest from '../../../helpers/IHttpRequest'
const UserRepository = new BaseRepository<IBaseModelType, UserModel>(UserModel)
class UserController extends BaseController<IBaseModelType, UserModel> {
  constructor () {
    super(UserRepository)
  }

  create = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const requiredFields = [
      'name',
      'email',
      'password',
      'passwordConfirmation'
    ]

    const errors = verifyMissingParams(httpRequest.body, requiredFields)

    if (errors.length) {
      return httpResponse.badRequest(new MissingParamError(errors))
    }

    const { name, email, password, passwordConfirmation } = httpRequest.body

    if (!validator.isEmail(email)) {
      return httpResponse.badRequest(new InvalidParamError('email'))
    }

    if (password !== passwordConfirmation) {
      return httpResponse.badRequest(
        new InvalidParamError('passwordConfirmation')
      )
    }

    const alreadyExists = await this.repository.findOne({ where: { email } })
    if (alreadyExists) {
      return httpResponse.badRequest(new DuplicatedUniqueError('email'))
    }

    const user = await this.repository.create({ name, email, password })

    return httpResponse.created({
      user: { ...user.get(), password: null },
      token: user.generateToken()
    })
  }

  login = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const requiredFields = ['email', 'password']
    const errors = verifyMissingParams(httpRequest.body, requiredFields)

    if (errors.length) {
      return httpResponse.badRequest(new MissingParamError(errors))
    }

    const { email, password } = httpRequest.body
    const user = await this.repository.findOne({ where: { email } })

    if (!(await user.checkPassword(password))) {
      return httpResponse.anauthorizedError()
    }
    return httpResponse.ok({
      token: user.generateToken()
    })
  }

  findOne = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const httpResponseUser = await super.findOne(httpRequest)
    return deletePassword(httpResponseUser)
  }

  listPaginated = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const httpResponseUser = await super.listPaginated(httpRequest)
    return deleteManyPasswords(httpResponseUser)
  }

  find = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const httpResponseUser = await super.find(httpRequest)
    return deletePassword(httpResponseUser)
  }

  update = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
    const httpResponseUser = await super.update(httpRequest)
    return deletePassword(httpResponseUser)
  }

  delete = async (httpRequest: IHttpRequest): Promise<IHttpResponse> =>
    await super.delete(httpRequest)
}

const deletePassword = (httpResponseUser: IHttpResponse): IHttpResponse => {
  if (httpResponseUser.statusCode === 200) {
    const user: IBaseModelType = httpResponseUser.body
    return httpResponse.ok({ ...user, password: null })
  }
  return httpResponseUser
}

const deleteManyPasswords = (
  httpResponseUser: IHttpResponse
): IHttpResponse => {
  if (httpResponseUser.statusCode === 200) {
    const result = httpResponseUser.body.result
    const users = result.map((res) => {
      const user = res
      return { ...user.get(), password: null }
    })
    httpResponseUser.body.result = users
    return httpResponseUser
  }
  return httpResponseUser
}

export default new UserController()
