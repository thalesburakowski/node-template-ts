import { Sequelize } from 'sequelize'

import fs from 'fs'
import path from 'path'
import dbConfig from '../config/database'
const config: any = dbConfig
const connection = new Sequelize(config)

function initAllModels (): void {
  // Equivaliente a importar e inicializar individualmente todos os models:
  // const User = require("../app/user/User.model.js");
  // User.start(connection)
  // User.sync()

  const normalizedPath = require('path').resolve('src', 'app', 'models')
  const folders = fs.readdirSync(normalizedPath)
  folders.forEach(folder => {
    const actualPath = path.join(normalizedPath, folder)
    const modelPath = fs
      .readdirSync(actualPath)
      .filter(file => file.includes('model'))
    modelPath.forEach(modelFile => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const model = require(path.join(actualPath, modelFile)).default
      model.start(connection)
      if (model.associate) {
        model.associate(connection)
      }
      model.sync()
    })
  })
}

initAllModels()

export default connection
