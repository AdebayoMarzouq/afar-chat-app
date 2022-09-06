const db = require('../models')

const room = async (req, res) => {
  const { user_id } = req.body
  const { user_id: current_user } = req.user

  // 
  // Take note, prevent creation of random rooms by random users who don't exist
  //

  if (!user_id) {
    return res.status(400).send({ message: 'Please provide a user ID' })
  }

  const roomExists = await db.Room.findOne({
    where: {
      is_group: false,
    },
    include: db.PrivateRoom,
  })

  if (
    (roomExists.PrivateRoom.user_one === current_user &&
      roomExists.PrivateRoom.user_two === user_id) ||
    (roomExists.PrivateRoom.user_one === user_id &&
      roomExists.PrivateRoom.user_two === current_user)
  ) {
    return res.status(200).send({
      message: 'These users have a room already',
      room: roomExists,
    })
  }
  // check if user exists
  const user = await db.User.findByPk(user_id)
  if (!user) {
    return res.status(400).send({message: 'This user does not exist'})
  }
  const room = await db.Room.create({})
  const privateRoom = await db.PrivateRoom.create({
    user_one: current_user,
    user_two: user_id,
  })
  await room.setPrivateRoom(privateRoom)

  const resroom = await db.Room.findAll({
    where: {
      is_group: false,
      user_one: {
        [db.Sequelize.Op.or]: [user_id, current_user],
      },
      user_two: {
        [db.Sequelize.Op.or]: [user_id, current_user],
      },
    },
    include: db.PrivateRoom,
  })
  res.status(201).send({ room: resroom })
}

module.exports = { room }
