import express from 'express'
// controllers
import deleteController from '../controllers/delete.js'

const router = express.Router()

router
  .delete('/root/:rootId', deleteController.deleteRoomById)
  .delete('/message/:messageId', deleteController.deleteMessageById)

export default router