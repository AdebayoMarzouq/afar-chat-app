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

module.exports = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            console.log('An error occurred while verifying JWT')
            socket.emit('error', 'Authenticatioin error, please log out and try logging in')
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
    console.log(socket.user.email, ' client connected to socket.io server')

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

    socket.on('leave_group', (room_id, user_id) => {
      console.log('left.....')
      socket.leave(room_id)
      socket.to(room_id).emit('user_left_group', room_id, user_id)
    })

    socket.on('user_removed', async(room_id, user_id) => {
      const roomSockets = await io.in(room_id).fetchSockets()
      for (let userSocket of roomSockets) {
        if (userSocket.user.user_id === user_id) { 
          userSocket.leave(room_id)
          userSocket.emit('you_have_been_removed_from_group', room_id)
          io.in(room_id).emit('user_left_group', room_id, user_id)
          break
        }
      }
    })

    socket.on('added_to_existing_group', async (room_id, users) => {
      const sockets = await io.fetchSockets()
      const room = await db.Room.findOne({
        where: { uuid: room_id },
        include: [
          { model: db.User, as: 'privateUserOne' },
          { model: db.User, as: 'privateUserTwo' },
        ],
      })
      const roomObj = room.toJSON()
      delete roomObj.id
      delete roomObj.creatorId
      const users_data = await Promise.all(
        users.map(async (user_email) => {
          try {
            return await db.User.findOne({
              where: { email: user_email },
            })
          } catch (error) {
            console.log(error)
          }
        })
      )
      io.in(room_id).emit('new_user_added_to_existing_room', room_id, users_data)
      for (const socketItem of sockets) {
        const user = users_data.find((user) => user.uuid === socketItem.user.user_id)
        if (user && socket.user.user_id !== user.uuid) {
          socketItem.join(room.uuid)
          socketItem.emit('added_to_existing_group', roomObj)
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
        return socket.emit('message_send_error', 'Please provide all details')
      }
      const room = await db.Room.findOne({
        where: { uuid: room_id },
      })
      if (!room) return res.status(404).json({ message: 'Room not found' })
      const user = await db.User.scope('withId').findOne({
        where: { uuid: user_id },
      })
      const isParticipant = await db.Participant.findOne({
        where: {UserId: user.id, RoomId: room.id}
      })
      if (!isParticipant) {
        return socket.emit('message_send_error', 'You are not a participant of this group.')
      }
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
      console.log(socket.user.email, ' A user disconnected from socket.io server')
    })
  })
}
