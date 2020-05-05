import IBaseModel from '../../bases/BaseModel/IBaseModel'

export default interface UserModel extends IBaseModel {
  name: string
  email: string
  password: string
}
