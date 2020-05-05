/* eslint-disable @typescript-eslint/restrict-template-expressions */
import request from 'supertest'
import app from '../../../app'
import truncate from '../../../../__tests__/utils/truncate'
import factory from '../../../../__tests__/utils/factories'
import faker from 'faker'
import {
  MissingParamError,
  InvalidParamError,
  DuplicatedUniqueError
} from '../../../errors'

describe('User', () => {
  beforeEach(async () => {
    await truncate()
  })

  describe('Create an User', () => {
    it('Should return MissingParamError when body attributes are not provided', async () => {
      const user = await factory.build('User', {
        name: null,
        email: '',
        password: ''
      })

      const response = await request(app)
        .post('/users')
        .send({
          ...user.dataValues,
          passwordConfirmation: user.password
        })

      const error = new MissingParamError([
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ])
      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        name: error.name,
        message: error.message
      })
    })

    it('Should return InvalidParamError when body email is invalid', async () => {
      const user = await factory.build('User', { email: 'email' })

      const response = await request(app)
        .post('/users')
        .send({
          ...user.dataValues,
          passwordConfirmation: user.password
        })
      expect(response.status).toBe(400)
      const error = new InvalidParamError('email')
      expect(response.body).toEqual({
        name: error.name,
        message: error.message
      })
    })

    it('Should return InvalidParamError when body passwordConfirmation is invalid', async () => {
      const user = await factory.build('User')

      const response = await request(app)
        .post('/users')
        .send({
          ...user.dataValues,
          passwordConfirmation: '123'
        })
      expect(response.status).toBe(400)
      const error = new InvalidParamError('passwordConfirmation')
      expect(response.body).toEqual({
        name: error.name,
        message: error.message
      })
    })

    it('Should return DuplicatedUniqueError when two emails are registred', async () => {
      const user = await factory.create('User')
      const response = await request(app)
        .post('/users')
        .send({
          ...user.get(),
          passwordConfirmation: user.password
        })
      expect(response.status).toBe(400)
      const error = new DuplicatedUniqueError('email')
      expect(response.body).toEqual({
        name: error.name,
        message: error.message
      })
    })

    it('Should return 201 if body is okay', async () => {
      const user = await factory.build('User')

      const response = await request(app)
        .post('/users')
        .send({
          ...user.dataValues,
          passwordConfirmation: user.password
        })
      expect(response.body.user.name).toBe(user.name)
      expect(response.body.user.email).toBe(user.email)
      expect(response.body.user.password).toBeFalsy()
      expect(response.body).toHaveProperty('token')
      expect(response.status).toBe(201)
    })
  })

  describe('Login', () => {
    it('Should make login', async () => {
      const user = await factory.create('User', {
        password: '1234'
      })

      const response = await request(app)
        .post('/login')
        .send({ email: user.email, password: '1234' })
      expect(response.body).toHaveProperty('token')
    })
  })

  describe('Get an User', () => {
    it('Should get an user', async () => {
      const user = await factory.create('User')
      const response = await request(app).get(`/users/${user.id}`)
      expect(response.body.name).toBe(user.name)
    })

    it('Should not get an user', async () => {
      const response = await request(app).get('/users/1')

      expect(response.status).toBe(500)
    })
  })

  describe('Update an User', () => {
    it('Should update an User', async () => {
      const user = await factory.create('User')
      const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ name: 'teste' })
      expect(response.status).toBe(200)
      expect(response.body.name).toBe('teste')
      expect(response.body.password).toBeFalsy()
    })

    it('Should not update an User', async () => {
      const response = await request(app)
        .put('/users/1')
        .send({ name: 'teste' })
      expect(response.status).toBe(500)
    })
  })

  describe('Get a list of Users', () => {
    it('Should return a list of users', async () => {
      const fakeUserList = generateFakeUsers(13)
      await factory.createMany('User', fakeUserList)
      const response = await request(app).get('/users?page=1&limit=10')
      expect(response.status).toBe(200)
      expect(response.body.pages).toBe(2)
      expect(response.body.result.length).toBe(10)
      expect(response.body.result[0].name).toBeTruthy()
      expect(response.body.result[0].password).toBeFalsy()
    })
  })

  describe('Delete an User', () => {
    it('Should delete an User', async () => {
      const user = await factory.create('User')
      const response = await request(app).delete(`/users/${user.id}`)
      expect(response.status).toBe(200)
    })
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
