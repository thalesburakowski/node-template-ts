export default interface IBaseRepository<T> {
  create(model): Promise<T>
  findOne(query): Promise<T>
  findByPk (id): Promise<T>
  listPaginated (page, limit): Promise<any>
  update (id: number, properties): Promise<T>
  delete (id: number): Promise<T>
}
