import IBaseController from './IBaseController'
import IBaseRepository from '../BaseRepository/IBaseRepository'
import httpResponse from '../../../helpers/HttpResponse'
import IHttpResponse from '../../../helpers/IHttpResponse'
import IBaseModelType from '../BaseModel/IBaseModel'
import IHttpRequest from '../../../helpers/IHttpRequest'
import { Model } from 'sequelize/types'

export default class BaseController<T1 extends IBaseModelType, T2 extends Model> implements IBaseController<T1 & T2> {
  constructor (readonly repository: IBaseRepository<T1 & T2>) {
  }

  async create (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const model: T1 = httpRequest.body
    const result = await this.repository.create(model)
    return httpResponse.created(result.get())
  }

  async findOne (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params
    const result = await this.repository.findByPk(id)
    return httpResponse.ok(result.get())
  }

  async find (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const model: T1 = httpRequest.body
    const result = await this.repository.findOne({ where: { ...model } })
    return httpResponse.ok(result.get())
  }

  public async listPaginated (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { page = 1, limit = 10 } = httpRequest.query
    const result = await this.repository.listPaginated(page, limit)
    return httpResponse.ok(result)
  }

  async update (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const id = httpRequest.params.id
    const properties = httpRequest.body
    const result = await this.repository.update(id, properties)
    return httpResponse.ok(result.get())
  }

  async delete (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { id } = httpRequest.params
    const result = await this.repository.delete(id)
    return httpResponse.ok(result)
  }
}
