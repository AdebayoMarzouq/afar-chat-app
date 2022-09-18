const db = require('../models')

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.io = io
    console.log('A user connected to socket.io server')

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
        ],
        order: [['updated_at', 'DESC']],
      })
    }

    socket.on('joinRooms', async ({ username, user_id }) => {
      const rooms = await getUserRooms(user_id)
      rooms.forEach((room) => {
        socket.join(room.uuid)
        console.log(`${username} joined room ${room.room_name}`)
      })
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
        socket.io.in(room_id).emit('message_received', room_id, returnObj)
      } catch (error) {
        console.log(error)
        await t.rollback()
        return socket.emit(
          'message_send_error',
          'Unable to send message, try again'
        )
      }
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected from socket.io server')
    })
  })
  io.on('disconnect', (socket) => {
    console.log('A user disconnected from socket.io server')
  })
}
