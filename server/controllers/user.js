import makeValidation from '@withvoid/make-validation'
import UserModel, { USER_TYPES } from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default {
  onGetAllUsers: async (req, res) => {
    try {
      const users = await UserModel.getAllUsers()
      return res.status(200).json({ success: true, users })
    } catch (error) {
      throw error
    }
  },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id)
      return res.status(200).json({ success: true, user })
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onCreateUser: async (req, res) => {
    try {
      const validation = makeValidation((types) => ({
        payload: req.body,
        checks: {
          firstName: {
            type: types.string
          },
          lastName: {
            type: types.string
          },
          type: {
            type: types.enum,
            options: {
              enum: USER_TYPES
            }
          }
        }
      }))
      if (!validation.success) return res.status(400).json(validation)

      const { firstName, lastName, type } = req.body
      const user = await UserModel.createUser(firstName, lastName, type)
      return res.status(200).json({ success: true, user })
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onDeleteUserById: async (req, res) => {
    try {
      const user = await UserModel.deleteUserById(req.params.id)
      return res.status(200).json({ success: true, message: `Deleted a count of ${user.deletedCount} user.` }) 
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  onRegister: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body
      if (!(email && password && firstName && lastName)) {
        res.status(400).json({ success: false, message:"All inputs are required" })
      }
      const oldUser = await UserModel.getUserByEmail(email);
      if (oldUser) {
        return res.status(409).json({ success:false, message: "User already exists. Please login." })
      }
      const encryptedPassword = await bcrypt.hash(password, 10)
      const user = await UserModel.register(firstName, lastName, email.toLowerCase(), encryptedPassword)
      return res.status(200).json({ success: true, user })
    } catch (error) {
      return res.status(500).json({ success:false, error })
    }
  },
  onLogin: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!(email && password)) {
        res.status(400).json({ success: false, message: "All inputs are required" })
      }
      const user = await UserModel.getUserByEmail(email)
      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            user_id: user._id,
            email
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "6h",
          }
        )
        res.status(200).json({ success: true, token })
      } else {
        res.status(400).json({ success: false, message: "Invalid Credentials" })
      }
    } catch (error) {
      res.status(500).json({ success: false, error }) 
    }
  }
}
