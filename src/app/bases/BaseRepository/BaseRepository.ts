/* eslint-disable @typescript-eslint/restrict-template-expressions */
import IBaseRepository from './IBaseRepository'

export default class BaseRepository<T1, T2>
implements IBaseRepository<T1 & T2> {
  constructor (private readonly Model) {}

  async create (item: T1): Promise<T1 & T2> {
    const result = await this.Model.create(item)
    return result
  }

  async findOne (query): Promise<T1 & T2> {
    const result = await this.Model.findOne(query)
    return result
  }

  async findByPk (id): Promise<T1 & T2> {
    const result = await this.Model.findByPk(id)
    return result
  }

  async listPaginated (page, limit): Promise<any> {
    const result = await this.Model.findAndCountAll({
      offset: (page - 1) * limit,
      limit
    })

    return {
      pages: Math.ceil(result.count / limit),
      result: result.rows
    }
  }

  async update (id: number, item: Partial<T1>): Promise<T1 & T2> {
    try {
      await this.Model.update(item, { where: { id } })
      const result = await this.Model.findByPk(id)
      return result
    } catch (error) {
      return null
    }
  }

  async delete (id): Promise<T1 & T2> {
    const result = await this.Model.destroy({ where: { id } })
    return result
  }
}
