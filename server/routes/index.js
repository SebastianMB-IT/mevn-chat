import express from 'express'
// controllers
import user from '../controllers/user.js'
// middlewares

const router = express.Router()

router
  .post('/register', user.onRegister)
  .post('/login', user.onLogin)

export default router
