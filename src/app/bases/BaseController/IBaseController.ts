import IHttpResponse from '../../../helpers/IHttpResponse'
import IHttpRequest from '../../../helpers/IHttpRequest'
import IBaseRepository from '../BaseRepository/IBaseRepository'

export default interface IBaseController<T> {
  repository: IBaseRepository<T>
  create(httpRequest: IHttpRequest): Promise<IHttpResponse>
  findOne(httpRequest: IHttpRequest): Promise<IHttpResponse>
  find(httpRequest: IHttpRequest): Promise<IHttpResponse>
  listPaginated (httpRequest: IHttpRequest): Promise<IHttpResponse>
  update (httpRequest: IHttpRequest): Promise<IHttpResponse>
  delete (httpRequest: IHttpRequest): Promise<IHttpResponse>
}
