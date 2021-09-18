import http from 'http'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'
import indexRouter from './routes/index.js'
import userRouter from './routes/user.js'
import chatRoomRouter from './routes/chatRoom.js'
import deleteRouter from './routes/delete.js'
import { verifyToken } from './middlewares/jwt.js'
import dotenv from 'dotenv'
import { connect } from './config/mongo.js'
import { Server } from "socket.io"
import WebSockets from './utils/WebSocket.js'

dotenv.config()
connect(process.env.MONGO_URI)

const app = express()
const port = '3004'

app.set('port', port)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', indexRouter)
app.use('/user', verifyToken, userRouter)
app.use('/room', verifyToken, chatRoomRouter)
app.use('/delete', verifyToken, deleteRouter)

app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
})

/** Create HTTP server. */
const server = http.createServer(app)
/** Create socket connection */
global.io = new Server(server);
global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
server.listen(port)
/** Event listener from HTTP server "listening" event. */
server.on('listening', () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
})