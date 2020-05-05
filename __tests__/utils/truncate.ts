import database from '../../src/database'

export default async (): Promise<any> => {
  return await Promise.all(
    Object.values(database.models).map(model => {
      return model.destroy({ truncate: true })
    })
  )
}
