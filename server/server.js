require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// use chithchat default profile images later

const db = require('./models')

// Routes
const authRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const roomRoutes = require('./routes/room')

// middlewares
const { notFoundMiddleware, errorHandlerMiddleware } = require('./middleware/errors')

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
    app.listen(PORT, console.log('listening on port ' + PORT))
    await db.sequelize.sync()
    // await db.sequelize.drop()
    console.log('Database synced')
  } catch (error) {
    console.log(error)
  }
}

start()