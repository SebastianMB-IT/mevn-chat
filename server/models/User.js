import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const USER_TYPES = {
  CONSUMER: 'consumer',
  SUPPORT: 'support'
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    firstName: String,
    lastName: String,
    email: String,
    password: String
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.statics.createUser = async function (firstName, lastName, type) {
  try {
    const user = await this.create({
      firstName,
      lastName,
      type
    })
    return user
  } catch (error) {
    throw error
  }
}

userSchema.statics.getUserById = async function (id) {
  try {
    const user = await this.findOne({ _id: id })
    if (!user) throw { error: 'No user with this id found' }
    return user
  } catch (error) {
    throw error
  }
}

userSchema.statics.getUserByEmail = async function (email) {
  try {
    const user = await this.findOne({ email: email })
    return user || null
  } catch (error) {
    throw error
  }
}

userSchema.statics.getAllUsers = async function () {
  try {
    const users = await this.find()
    if (!users) throw { error: 'No users found' }
    return users
  } catch (error) {
    throw error
  }
}

userSchema.statics.deleteUserById = async function (id) {
  try {
    const res = await this.remove({ _id: id })
    return res
  } catch (error) {
    throw error
  }
}

userSchema.statics.register = async function (firstName, lastName, email, password) {
  try {
    const user = await this.create({
      firstName,
      lastName,
      email,
      password
    })
    return user
  } catch (error) {
    throw error
  }
}

export default mongoose.model('User', userSchema)
