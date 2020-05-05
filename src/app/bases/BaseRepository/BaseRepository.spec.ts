import UserModel from '../../models/user/User.model'
import BaseRepository from './BaseRepository'
import truncate from '../../../../__tests__/utils/truncate'
import factory from '../../../../__tests__/utils/factories'
import faker from 'faker'
import UserTypes from '../../models/user/User'
const UserRepository = new BaseRepository<UserTypes, UserModel>(UserModel)

describe('BaseRepository', () => {
  beforeEach(async () => {
    await truncate()
  })

  it('Should create a user', async () => {
    const userBuilded = await factory.build('User')

    const user = await UserRepository.create(userBuilded.dataValues)
    expect(userBuilded.email).toBe(user.email)
  })

  it('Should find a user', async () => {
    const user = await factory.create('User')
    const userFinded = await UserRepository.findOne({ where: { email: user.email } })
    expect(userFinded.email).toBe(user.email)
  })

  it('Should not find a user', async () => {
    try {
      await factory.create('User', { email: 'teste@email.com' })
      await UserRepository.findOne({ where: { email: 'testezinho@gmail.com' } })
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })

  it('Should update a user', async () => {
    const userModel = await factory.create('User')
    const userUpdated = await UserRepository.update(userModel.id, { email: 'thales@gmail.com' })
    expect(userUpdated.email).toBe('thales@gmail.com')
  })

  it('Should not update a user', async () => {
    try {
      const userModel = await factory.create('User')

      await UserRepository.update(userModel.id, { email: null })
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })

  it('Should return a list of users', async () => {
    const fakeUserList = generateFakeUsers(3)
    await factory.createMany('User', fakeUserList)
    const result = await UserRepository.listPaginated(1, 10)
    expect(result.result.length).toBe(3)
  })

  it('Should return a list of 10 users', async () => {
    const fakeUserList = generateFakeUsers(13)
    await factory.createMany('User', fakeUserList)
    const result = await UserRepository.listPaginated(1, 10)
    expect(result.pages).toBe(2)
    expect(result.result.length).toBe(10)
  })

  it('Should return a list of 3 users on page 2', async () => {
    const fakeUserList = generateFakeUsers(13)
    await factory.createMany('User', fakeUserList)
    const result = await UserRepository.listPaginated(2, 10)
    expect(result.pages).toBe(2)
    expect(result.result.length).toBe(3)
  })

  it('Should delete a user', async () => {
    try {
      const user = await factory.create('User')
      const userFinded = await UserRepository.findOne({ where: { email: user.email } })
      expect(userFinded).toBeTruthy()
      await UserRepository.delete(user.id)
      await UserRepository.findOne({ where: { email: user.email } })
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })
})

function generateFakeUsers (quantity = 1): any[] {
  const users = []
  for (let index = 0; index < quantity; index++) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })
  }
  return users
}
