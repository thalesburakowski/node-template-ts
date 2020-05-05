import { Response } from 'express'
import IHttpRequest from '../../helpers/IHttpRequest'
import HttpResponseHelper from '../../helpers/HttpResponse'
import { IRequestWithUser } from './protocols'

export = {
  adapt (controller) {
    return async (req: IRequestWithUser, res: Response): Promise<void> => {
      const httpRequest: IHttpRequest = {
        body: req.body,
        params: req.params,
        query: req.query,
        accountId: req.accountId
      }
      const httpResponse = await logControllerDecorator(controller, httpRequest)
      res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

const logControllerDecorator = async (
  controller: (httpRequest: IHttpRequest) => Promise<void>,
  httpRequest: IHttpRequest
): Promise<any> => {
  try {
    return await controller(httpRequest)
  } catch (error) {
    console.error(error)
    return HttpResponseHelper.serverError()
  }
}
