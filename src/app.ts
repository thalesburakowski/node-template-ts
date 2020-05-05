import express from 'express'
import cors from 'cors'
import routes from './routes'
import dotenv from 'dotenv'
import './database'

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

class AppController {
  public express: express.Application
  public routes = routes

  constructor () {
    this.express = express()
    this.middlewares()
    this.router()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private router (): void {
    this.express.use(this.routes)
  }
}

export default new AppController().express
