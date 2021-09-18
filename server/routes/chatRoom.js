import express from 'express'
// controllers
import chatRoom from '../controllers/chatRoom.js'

const router = express.Router()

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:rootId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/:rootId/message', chatRoom.postMessage)
  .put(':rootId/mark-read', chatRoom.markConversationReadByRoomId)

export default router