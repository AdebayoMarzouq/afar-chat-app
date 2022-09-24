const db = require('../models')
const jwt = require('jsonwebtoken')

const getUserRooms = async (user_id) => {
  const user = await db.User.scope('withId').findOne({
    where: { uuid: user_id },
  })
  return await db.Room.scope('withoutId').findAll({
    attributes: [
      'uuid',
      'room_name',
      'is_group',
      'last_message',
      'created_at',
      'updated_at',
    ],
    include: [
      { model: db.User, as: 'creator' },
      {
        model: db.Participant,
        where: { UserId: user.id },
        attributes: [],
      },
      { model: db.User, as: 'privateUserOne' },
      { model: db.User, as: 'privateUserTwo' },
    ],
    order: [['updated_at', 'DESC']],
  })
}

const addParticipantToGroup = () => {
  const {room_id, user_id} = req.body
}

module.exports = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            console.log('An error occurred while verifying JWT')
            return next(new Error('Authentication error'))
          }
          socket.user = decoded
          next()
        }
      )
    } else {
      console.log('an error occured')
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', async (socket) => {

    socket.on('created_new_group', async (room_id) => {
      const sockets = await io.fetchSockets()
      const room = await db.Room.findOne({
        where: { uuid: room_id },
        include: [
          { model: db.User, as: 'privateUserOne' },
          { model: db.User, as: 'privateUserTwo' },
        ],
      })
      const users = await room.getRoomParticipants()
      const roomObj = room.toJSON()
      delete roomObj.id
      delete roomObj.creatorId
      socket.join(room.uuid)
      socket.emit('added_to_new_group', roomObj)
      for (const socketItem of sockets) {
        const user = users.find(user => user.uuid === socketItem.user.user_id)
        if (user && socket.user.user_id !== user.uuid) {
          socketItem.join(room.uuid)
          socketItem.emit('added_to_new_group', roomObj)
        }
      }
    })

    socket.on('joinRooms', async ({ username, user_id }) => {
      const rooms = await getUserRooms(user_id)
      rooms.forEach((room) => {
        socket.join(room.uuid)
        console.log(`${username} joined room ${room.room_name}`)
      })
    })

    socket.on('joinRoom', (room_id) => {
      socket.join(room_id)
    })

    socket.on('send_message', async (messageObj) => {
      const { user_id, room_id, message } = messageObj
      if (!user_id || !message || !room_id) {
        socket.emit('message_send_error', 'Please provide all details')
      }
      const room = await db.Room.findOne({
        where: { uuid: room_id },
      })
      if (!room) return res.status(404).json({ message: 'Room not found' })
      const user = await db.User.scope('withId').findOne({
        where: { uuid: user_id },
      })
      const t = await db.sequelize.transaction()
      try {
        const createdMessage = await db.Message.create(
          { RoomId: room.id, UserId: user.id, message_text: message },
          { transaction: t }
        )
        await room.update({ last_message: message }, { transaction: t })
        await t.commit()
        const returnObj = {
          uuid: user.uuid,
          email: user.email,
          username: user.username,
          profile_image: user.profile_image,
          created_at: user.created_at,
          updated_at: user.updated_at,
          Message: {
            uuid: createdMessage.uuid,
            message_text: createdMessage.message_text,
            deleted_at: createdMessage.deleted_at,
            sent_at: createdMessage.sent_at,
            updated_at: createdMessage.updated_at,
            repliedMessageId: createdMessage.repliedMessageId,
          },
        }
        io.in(room_id).emit('message_received', room_id, returnObj)
      } catch (error) {
        console.log(error)
        await t.rollback()
        socket.emit(
          'message_send_error',
          'Unable to send message, try again'
        )
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected from socket.io server')
    })
  })
}
