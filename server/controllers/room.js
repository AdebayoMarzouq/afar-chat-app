const { CustomError } = require('../errors')
const db = require('../models')
const { StatusCodes } = require('http-status-codes')

const getOrCreatePrivateRoom = async (req, res) => {
  const { user_id } = req.body
  const current_user = req.user.id

  if (!user_id) {
    throw new CustomError('Please provide a user ID', StatusCodes.BAD_REQUEST)
  }

  const user = await db.User.scope('withId').findOne({
    where: { uuid: user_id },
  })

  if (!user) {
    throw new CustomError('This user does not exist.', StatusCodes.BAD_REQUEST)
  }

  const haveRoom = await db.Room.findOne({
    where: { privateUserOneId: current_user, privateUserTwoId: user.id },
  })

  if (haveRoom) {
    throw new CustomError('Users have an existing room', StatusCodes.BAD_REQUEST)
  }

  const t = await db.sequelize.transaction()

  try {
    const room = await db.Room.create(
      { privateUserOneId: current_user, privateUserTwoId: user.id },
      { transaction: t }
    )
    await room.addRoomParticipants([current_user, user.id], {
      transaction: t,
    })
    await t.commit()
    res
      .status(201)
      .send({ message: 'Room created successfully', room_id: room.uuid })
  } catch (error) {
    await t.rollback()
    throw new CustomError('Unable to start chat, try again', StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

const createGroup = async (req, res) => {
  const { room_name, users: groupUsers } = req.body

  if (!room_name || !groupUsers) {
    throw new CustomError('Please fill all fields', StatusCodes.BAD_REQUEST)
  }

  const users = JSON.parse(groupUsers)

  if (users.length < 2) {
    throw new CustomError('Only two or more users can form a group', StatusCodes.BAD_REQUEST)
  }

  users.unshift(req.user.email)

  const users_data = await Promise.all(
    users.map(async (user_email) => {
      try {
        return await db.User.scope('withId').findOne({
          where: { email: user_email },
        })
      } catch (error) {
        throw new CustomError('Could not find user' + user_email, StatusCodes.BAD_REQUEST)
      }
    })
  )

  const t = await db.sequelize.transaction()

  try {
    const current_user = req.user.id

    const room = await db.Room.create(
      { room_name, creatorId: current_user, is_group: true },
      { transaction: t }
    )
    await room.addRoomParticipants([...users_data], { transaction: t })
    await t.commit()
    return res
      .status(201)
      .send({ message: 'created group successfully', room_id: room.uuid })
  } catch (error) {
    await t.rollback()
    throw new CustomError(
      'Unable to create group, try again',
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

const getRoomsAndGroups = async (req, res) => {
  const rooms = await db.Room.scope('withoutId').findAll({
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
        where: { UserId: req.user.id },
        attributes: [],
      },
      { model: db.User, as: 'privateUserOne' },
      { model: db.User, as: 'privateUserTwo' },
    ],
    order: [['updated_at', 'DESC']],
  })
  res.status(200).json({ count: rooms.length, rooms })
}

const getRoomByUUID = async (req, res) => {
  const { room_id } = req.params
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    attributes: { exclude: ['privateUserOneId', 'privateUserTwoId'] },
    include: [
      { model: db.User, as: 'creator' },
      {
        model: db.Participant,
        where: { UserId: req.user.id },
        attributes: [],
      },
    ],
  })
  if (!room) {
    throw new CustomError('Room does not exist', StatusCodes.BAD_REQUEST)
  }
  const participants = await room.getRoomParticipants({
    joinTableAttributes: ['joined_at'],
  })
  const messages = await room.getRoomMessages({
    joinTableAttributes: [
      'uuid',
      'message_text',
      'deleted_at',
      'sent_at',
      'updated_at',
      'repliedMessageId',
    ],
  })
  messages.sort(function (a, b) {
    if (a.Message.updated_at < b.Message.updated_at) return -1
    else if (a.Message.updated_at > b.Message.updated_at) return 1
    return 0
  })
  const roomObj = room.toJSON()
  delete roomObj.id
  delete roomObj.creatorId
  res.status(200).json({ room: roomObj, participants, messages })
}

const updateGroup = async (req, res) => {
  const { room_id, room_name } = req.body
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    include: { model: db.User, as: 'creator' },
  })
  if (!room) {
    throw new CustomError('Room does not exist', StatusCodes.BAD_REQUEST)
  }
  if (req.user.user_id !== room.creator.uuid) {
    throw new CustomError('You are not authorized to edit this room')
  }
  await room.set({ room_name })
  await room.save()
  return res.status(200).json({ message: 'Room updated' })
}

const deleteGroup = async (req, res) => {
  const { room_id } = req.params
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    include: { model: db.User, as: 'creator' },
  })
  if (req.user.user_id !== room.creator.uuid) {
    throw new CustomError('You are not authorized to delete this room', StatusCode.UNAUTHORIZED)
  }
  await room.destroy()
  return res
    .status(StatusCodes.OK)
    .message({ message: 'Successfully deleted' })
}

const addParticipantToGroup = async (req, res) => {
  const { room_id, groupUsers } = req.body

  // *Add consideration for adding bulk participants later by passing users as a list

  const users = JSON.parse(groupUsers)
  const users_data = await Promise.all(
    users.map(async (user_email) => {
      try {
        return await db.User.scope('withId').findOne({
          where: { email: user_email },
        })
      } catch (error) {
        throw new CustomError('User not found: ' + user_email, StatusCodes.BAD_REQUEST)
      }
    })
  )

  const room = await db.Room.findOne({
    where: { uuid: room_id, is_group: true },
    include: { model: db.User, as: 'creator' },
  })
  if (!room) throw new CustomError('Room does not exist', StatusCodes.BAD_REQUEST)
  if (req.user.user_id !== room.creator.uuid) {
    throw new CustomError('You are not authorized to add participants to this group.', StatusCodes.UNAUTHORIZED)
  }
  const t = await db.sequelize.transaction()
    try {
      await room.addRoomParticipants([...users_data], { transaction: t })
      await t.commit()
      return res
        .status(201)
        .send({ message: 'User(s) added successfully', room_id: room.uuid })
    } catch (error) {
      await t.rollback()
      throw new CustomError('Unable to add user', StatusCodes.BAD_REQUEST)
    }
}

const removeParticipantFromGroup = async (req, res) => {
  const { room_id, user_id } = req.body
  const room = await db.Room.findOne({
    where: { uuid: room_id, is_group: true },
    include: { model: db.User, as: 'creator' },
  })
  if (req.user.user_id !== room.creator.uuid) {
    throw new CustomError('You are not authorized to remove participants fro this group', StatusCodes.UNAUTHORIZED)
  }
  const user = await db.User.scope('withId').findOne({
    where: { uuid: user_id },
  })
  const room_participant = await db.Participant.findOne({
    where: { UserId: user.id, RoomId: room.id },
  })
  await room_participant.destroy()
  return res.status(200).send({ message: 'user removed successfully' })
}

const leaveGroup = async (req, res) => {
  const { room_id, user_id } = req.body
  const room = await db.Room.findOne({
    where: { uuid: room_id, is_group: true },
    include: { model: db.User, as: 'creator' },
  })
  if (!room) {
    throw new CustomError('Room does not exist', StatusCodes.BAD_REQUEST)
  }
  const user = await db.User.scope('withId').findOne({
    where: { uuid: user_id },
  })
  if (!user) {
    throw new CustomError('User not found', StatusCodes.BAD_REQUEST)
  }
  const room_participant = await db.Participant.findOne({
    where: { UserId: user.id, RoomId: room.id },
  })
  await room_participant.destroy()
  return res.status(200).send({ message: 'user removed successfully' })
}

module.exports = {
  getOrCreatePrivateRoom,
  createGroup,
  getRoomsAndGroups,
  getRoomByUUID,
  updateGroup,
  deleteGroup,
  addParticipantToGroup,
  removeParticipantFromGroup,
  leaveGroup,
}
