require('dotenv').config()
require('express-async-errors')
const express = require('express')
const { createServer } = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  pingTimeout: 1000,
  cors: {
    origin: 'http://localhost:5173',
  }
})

// use chithchat default profile images later

const db = require('./models')

// Routes
const authRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const roomRoutes = require('./routes/room')

// middlewares
const {
  notFoundMiddleware,
  errorHandlerMiddleware,
} = require('./middleware/errors')

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.send('connnected')
})

// routes
app.use('/api/account', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/chat', roomRoutes)

// Not Found and Error Middlewares
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000

const start = async () => {
  try {
    await db.sequelize.sync()
    // await db.sequelize.sync({alter: true})
    // await db.sequelize.sync({force: true})
    // await db.sequelize.drop()
    console.log('Database synced')
    httpServer.listen(PORT, console.log('listening on port ' + PORT))
    require('./controllers/socket')(io)
  } catch (error) {
    console.log(error)
  }
}

module.exports.io = io
start()
