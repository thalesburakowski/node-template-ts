import { Request } from 'express'
export interface IRequestWithUser extends Request {
  accountId: string
}
