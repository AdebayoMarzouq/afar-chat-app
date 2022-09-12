const db = require('../models')
const { StatusCodes } = require('http-status-codes')

const getOrCreatePrivateRoom = async (req, res) => {
  const { user_id } = req.body
  const { user_id: current_user } = req.user

  if (!user_id) {
    return res.status(400).send({ message: 'Please provide a user ID' })
  }

  // check if user exists
  // Prevent creation of random rooms with random users who don't exist
  const user = await db.User.findOne({ where: { uuid: user_id } })
  if (!user) {
    return res.status(400).send({ message: 'This user does not exist' })
  }

  const haveRoom = await db.sequelize.query(
    `SELECT * from room r WHERE is_group = 0 AND EXISTS (SELECT 1 from participant p WHERE p.RoomId = r.id AND p.UserId = '${current_user}') AND EXISTS (SELECT 1 from participant p WHERE p.RoomId = r.id AND p.UserId = '${user_id}')`,
    { type: db.Sequelize.QueryTypes.SELECT }
  )

  if (haveRoom.length) {
    // const room_id = haveRoom[0].id
    // const room = await db.Room.findByPk(room_id)
    // const room_users = room.getUsers()
    return res
      .status(400)
      .json({ msg: 'These users have a room already', room: haveRoom })
  }

  const t = await db.sequelize.transaction()

  try {
    const room = await db.Room.create({}, { transaction: t })
    const participantOne = await db.User.findOne(
      { where: { uuid: current_user } },
      {
        transaction: t,
      }
    )
    const participantTwo = await db.User.findOne(
      { where: { uuid: user_id } },
      { transaction: t }
    )
    await room.addUsers([participantOne, participantTwo], { transaction: t })
    await t.commit()
    res.status(201).send({ message: 'Room created successfully', room })
  } catch (error) {
    await t.rollback()
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Unable to create room', error: error.message })
  }
}

const createGroup = async (req, res) => {
  const { room_name, users: groupUsers } = req.body

  if (!room_name || !groupUsers) {
    res.statusu(404).send({ message: 'Please fill all fields' })
  }

  const users = JSON.parse(groupUsers)

  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: 'Only two or more users can form a group' })
  }

  users.unshift(req.user.email)

  const users_data = await Promise.all(
    users.map(async (user_email) => {
      try {
        return await db.User.scope('withId').findOne({
          where: { email: user_email },
        })
      } catch (error) {
        res.status(400).send({
          message: 'An error occured, could not find user' + user_email,
        })
      }
    })
  )

  const t = await db.sequelize.transaction()

  try {
    const current_user = await db.User.scope('withId').findOne({
      where: { uuid: req.user.user_id },
    })

    const room = await db.Room.create(
      { room_name, creatorId: current_user.id, is_group: true },
      { transaction: t }
    )

    await room.addUsers([...users_data], { transaction: t })
    const resroom = await db.Room.findByPk(room.id)
    await t.commit()
    return res
      .status(201)
      .send({ message: 'created group successfully', rooms: resroom })
  } catch (error) {
    await t.rollback()
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Unable to start chat', error: error.message })
  }
}

const getRoomsAndGroups = async (req, res) => {
  // const rooms = await db.Participant.findAll({
  //   where: { userId: req.user.user_id },
  //   // attributes: [],
  //   include: [
  //     {
  //       model: db.Room,
  //       include: [
  //         { model: db.Participant, include: [{ model: db.User }] },
  //         {
  //           model: db.User,
  //           as: 'admin',
  //         },
  //         // { model: db.Message, include: [{ model: db.User }] },
  //       ],
  //     },
  //   ],
  //   order: [['updated_at', 'DESC']],
  // })

  const user = await db.User.scope('withId').findOne({
    where: { uuid: req.user.user_id },
  })

  const rooms = await db.Room.findAll({
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

  // const rooms2 = await db.Room.findAll({
  //   include: [
  //     {model: db.User, as: 'creator'},
  //     {
  //       model: db.Participant,
  //       attributes: ['UserId'],
  //       include: {model: db.User, attributes: {exclude: ['UserId']}},
  //     },
  //   ],
  //   order: [['updated_at', 'DESC']],
  // })
  res.status(200).json({ count: rooms.length, rooms })
}

const updateGroup = async (req, res) => {
  const { room_id, room_name } = req.body
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    include: { model: db.User, as: 'creator' },
  })
  if (req.user.user_id === room.creator.uuid) {
    await room.set({ room_name })
    await room.save()
    return res.status(200).json({ message: 'Room updated' })
  }
  res
    .status(StatusCodes.UNAUTHORIZED)
    .send({ message: 'You are not authorized to edit this room name' })
}

const addParticipantToGroup = async (req, res) => {
  const { room_id, user_id } = req.body
  // Add consideration for adding bulk participants later by passing users as a list
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    include: { model: db.User, as: 'creator' },
  })
  if (!room) return res.status(404).json({ message: 'Room does not exist' })
  const user = await db.User.findOne({ where: { uuid: user_id } })
  if (!user) return res.status(404).json({ message: 'User does not exist' })
  if (req.user.user_id === room.creator.uuid) {
    await room.addUser(user.id)
    return res.status(200).send({ message: 'user added successfully' })
  }
  res
    .status(StatusCodes.UNAUTHORIZED)
    .message({
      message: 'You are not authorized to add participants to this group',
    })
}

const removeParticipantFromGroup = async (req, res) => {
  const { room_id, user_id } = req.body
  const room = await db.Room.findOne({
    where: { uuid: room_id },
    include: { model: db.User, as: 'creator' },
  })
  if (req.user.user_id === room.creator.uuid) {
    const user = await db.User.findOne({ where: { uuid: user_id } })
    const room_participant = await db.Participant.findOne({
      where: { UserId: user.id, RoomId: room.id },
    })
    await room_participant.destroy()
    res.status(200).send({ message: 'user removed successfully' })
  }
  res.status(StatusCodes.UNAUTHORIZED).message({message: 'You are not authorized to remove participants from this group'})
}

module.exports = {
  getOrCreatePrivateRoom,
  createGroup,
  getRoomsAndGroups,
  updateGroup,
  addParticipantToGroup,
  removeParticipantFromGroup,
}
