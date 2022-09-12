const db = require('../models')
const { StatusCodes } = require('http-status-codes')

const room = async (req, res) => {
  const { user_id } = req.body
  const { user_id: current_user } = req.user

  //
  // Take note, prevent creation of random rooms by random users who don't exist
  //

  if (!user_id) {
    return res.status(400).send({ message: 'Please provide a user ID' })
  }

  const haveRoom = await db.sequelize.query(
    `SELECT * from room r WHERE is_group = 0 AND EXISTS (SELECT 1 from participant p WHERE p.RoomId = r.id AND p.UserId = '${current_user}') AND EXISTS (SELECT 1 from participant p WHERE p.RoomId = r.id AND p.UserId = '${user_id}')`,
    { type: db.Sequelize.QueryTypes.SELECT }
  )

  if (haveRoom.length) {
    const room_id = haveRoom[0].id
    const room = await db.Room.findByPk(room_id)
    const room_users = room.getUsers()
    return res
      .status(200)
      .json({ msg: 'room exists', result: haveRoom, join: room_users })
  }
  // check if user exists
  const user = await db.User.findByPk(user_id)
  if (!user) {
    return res.status(400).send({ message: 'This user does not exist' })
  }

  const t = await db.sequelize.transaction()

  try {
    const room = await db.Room.create({}, { transaction: t })
    const participantOne = await db.User.findByPk(current_user, {
      transaction: t,
    })
    const participantTwo = await db.User.findByPk(user_id, { transaction: t })
    await room.addUsers([participantOne, participantTwo], { transaction: t })
    await t.commit()
    const resroom = await db.Room.findAll({
      where: {
        is_group: false,
        id: room.id,
      },
      include: db.User,
    })
    res.status(201).send({ rooms: resroom })
  } catch (error) {
    await t.rollback()
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Unable to start chat', error: error.message })
  }
}

const group = async (req, res) => {
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

  users.unshift(req.user.user_id)

  const t = await db.sequelize.transaction()

  try {
    const room = await db.Room.create(
      { room_name, adminId: req.user.user_id, is_group: true },
      { transaction: t }
    )
    await room.addUsers([...users], { transaction: t })
    const resroom = await db.Room.findAll(
      {
        where: {
          is_group: true,
          id: room.id,
        },
        include: [
          { model: db.User, as: 'admin' },
          {
            model: db.Participant,
            where: { RoomId: room.id },
            include: [{ model: db.User }],
          },
        ],
      },
      { transaction: t }
    )
    await t.commit()
    return res.status(201).send({ rooms: resroom })
  } catch (error) {
    await t.rollback()
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Unable to start chat', error: error.message })
  }
}

const getRooms = async (req, res) => {
  const rooms = await db.Participant.findAll({
    where: { userId: req.user.user_id },
    // attributes: [],
    include: [
      {
        model: db.Room,
        include: [
          { model: db.Participant, include: [{ model: db.User }] },
          {
            model: db.User,
            as: 'admin',
          },
          // { model: db.Message, include: [{ model: db.User }] },
        ],
      },
    ],
    order: [['updated_at', 'DESC']],
  })
  res.status(200).json({ count: rooms.length, rooms: rooms })
}

const updateRoom = async (req, res) => { 
  const { room_id, room_name } = req.body
  const room = await db.Room.findByPk(room_id)
  await room.set({room_name})
  await room.save()
  res.status(200).json({ message: 'Room updated', room })
}

const addParticipant = async (req, res) => {
  const { room_id, user_id } = req.body
  const room = await db.Room.findByPk(room_id)
  if (!room) return res.status(404).json({ message: 'Room does not exist' })
  const user = await db.User.findByPk(user_id)
  if (!user) return res.status(404).json({ message: 'User does not exist' })
  await room.addUser(user_id)
  const room_participant = await db.Participant.findOne({
    where: { UserId: user_id, RoomId: room_id },
    include: db.Room,
  })
  res.status(200).send({message: 'user added successfully', room, room_participant})
}

const removeParticipant = async (req, res) => {
  const { room_id, user_id } = req.body
  const room_participant = await db.Participant.findOne({
    where: { UserId:user_id, RoomId:room_id },
  })
  await room_participant.destroy()
  res.status(200).send({ message: 'user removed successfully' })
}

module.exports = { room, getRooms, group, updateRoom, addParticipant, removeParticipant}
