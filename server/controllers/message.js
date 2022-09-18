const db = require('../models')
const { StatusCodes } = require('http-status-codes')

const sendMessage = async (req, res) => {
  const { message, room_id } = req.body
  if (!message || !room_id) {
    return res.status(400).send({ message: 'Could not send message' })
  }
  const room = await db.Room.findOne({
    where: { uuid: room_id },
  })
  if (!room) return res.status(404).json({ message: 'Room not found' })
  const user = await db.User.scope('withId').findOne({
    where: { uuid: req.user.user_id },
  })
  const t = await db.sequelize.transaction()
  try {
    await db.Message.create({ RoomId: room.id, UserId: user.id, message_text: message }, { transaction: t })
    await room.update({last_message: message}, {transaction: t})
    await t.commit()
    res.status(200).send({ message: 'Message sent' })
  } catch (error) {
    await t.rollback()
    return res
    .status(StatusCodes.BAD_REQUEST)
    .send({ message: 'Unable to send message', error: error.message, errorMain: error })
  }
  res.status(500)
}

const sendMessageBySocket = async () => {
  
}

module.exports = { sendMessage }
