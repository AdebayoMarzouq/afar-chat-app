const { Op } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const db = require('../models')
const { io } = require('../server')

const users = async (req, res) => {
  const { search } = req.query
  const users = await db.User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.substring]: search } },
        { email: { [Op.substring]: search } },
      ],
      [Op.not]: [{ uuid: req.user.user_id }],
    },
  })
  // io.emit('usersReq', {search: search})
  res.status(StatusCodes.OK).json({ status: StatusCodes.OK, users })
}

module.exports = { users }
