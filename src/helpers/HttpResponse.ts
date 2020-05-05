import { UnauthorizedError, ServerError } from '../errors'

import IHttpResponse from './IHttpResponse'

const serverError = new ServerError()
const unauthorizedError = new UnauthorizedError()

export default {
  badRequest (error: Error): IHttpResponse {
    return {
      statusCode: 400,
      body: {
        name: error.name,
        message: error.message
      }
    }
  },

  unauthorized (message): IHttpResponse {
    return {
      statusCode: 401,
      body: {
        name: unauthorizedError.name,
        message: message
      }
    }
  },

  serverError (): IHttpResponse {
    return {
      statusCode: 500,
      body: {
        name: serverError.name,
        message: 'Ocorreu um erro, contate o administrador do sistema'
      }
    }
  },

  anauthorizedError (): IHttpResponse {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  },

  ok (data: object): IHttpResponse {
    return {
      statusCode: 200,
      body: data
    }
  },

  created (data: object): IHttpResponse {
    return {
      statusCode: 201,
      body: data
    }
  }
}
