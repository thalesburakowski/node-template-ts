import fs from 'fs'
import path from 'path'
const normalizedPath = path.resolve('src', 'app', 'models')

const routes = []

const folders = fs.readdirSync(normalizedPath)
folders.forEach(folder => {
  const actualPath = path.join(normalizedPath, folder)
  const modelPath = fs
    .readdirSync(actualPath)
    .filter(file => file.includes('route'))
  modelPath.forEach(model => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    routes.push(require(path.join(actualPath, model)).default)
  })
})

export default routes
