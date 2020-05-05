import redis from 'redis'
import { Request, Response, NextFunction } from 'express'
const cache = redis.createClient(process.env.REDIS_PORT)

export const get = (
  req: Request,
  res: Response,
  next: NextFunction,
  key: string
): void => {
  cache.get(key, (err, data) => {
    if (err) throw err
    if (data) {
      res.send(data)
    }
    next()
  })
}

export const set = (key: string, seconds: number, value: any): void => {
  cache.setex(key, seconds, JSON.stringify(value))
}
