import User from './User.model'
import truncate from '../../../../__tests__/utils/truncate'
import UserModel from './User'

import bcrypt from 'bcryptjs'

describe('User', () => {
  beforeEach(async () => {
    await truncate()
  })
  it('Should create user', async () => {
    const user = await User.create({ name: 'Test', email: 'test@gmail.com', password: '1234' })
    expect(user).toBeTruthy()
  })

  it('Should create user with password hashed', async () => {
    const user: UserModel = await User.create({ name: 'Test', email: 'test@gmail.com', password: '1234' })
    const compareHash = await bcrypt.compareSync('1234', user.password)
    expect(user).toBeTruthy()
    expect(compareHash).toBe(true)
  })

  it('Should not create user', async () => {
    try {
      await User.create({ name: 'Test', email: 'test@gmail.com' })
    } catch (error) {
      expect(error).toBeTruthy()
    }
  })
})
