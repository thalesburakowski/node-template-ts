import { Router } from 'express'
import UserController from './User.controller'
import ExpressRouterAdapter from '../../middlewares/ExpressRouterAdapter'

const routes = Router()

routes.post('/users', ExpressRouterAdapter.adapt(UserController.create))
routes.post('/login', ExpressRouterAdapter.adapt(UserController.login))
routes.get('/users/:id', ExpressRouterAdapter.adapt(UserController.findOne))
routes.put('/users/:id', ExpressRouterAdapter.adapt(UserController.update))
routes.get('/users', ExpressRouterAdapter.adapt(UserController.listPaginated))
routes.delete('/users/:id', ExpressRouterAdapter.adapt(UserController.delete))

export default routes
