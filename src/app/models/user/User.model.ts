import { Model, DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

class User extends Model {
  checkPassword: (password: string) => Promise<boolean>
  generateToken: () => string
  static start (sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        hooks: {
          beforeSave: async (user: any): Promise<void> => {
            if (user.password) {
              user.password = await bcrypt.hash(user.password, 8)
            }
          }
        }
      }
    )
  }
}

User.prototype.checkPassword = async function (password: string): Promise<boolean> {
  const hash = await bcrypt.compareSync(password, this.password)
  return hash
}

User.prototype.generateToken = function (): string {
  return jwt.sign({ id: this.id }, process.env.APP_SECRET, { expiresIn: '1h' })
}

export default User
