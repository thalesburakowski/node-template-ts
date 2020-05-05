import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import HttpResponseHelper from '../../helpers/HttpResponse'
import IHttpResponse from '../../helpers/IHttpResponse'
import { Response, NextFunction } from 'express'
import { IRequestWithUser } from './protocols'

export default async (req: IRequestWithUser, res: Response, next: NextFunction): Promise<IHttpResponse> => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return HttpResponseHelper.unauthorized('Token not provided')
  }

  const [, token] = authHeader.split(' ')
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET)
    req.accountId = decoded
    next()
  } catch (error) {
    console.error(error)
    const httpResponse = HttpResponseHelper.unauthorized('Token invalid')
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
