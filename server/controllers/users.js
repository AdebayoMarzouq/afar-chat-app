const { Op } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const db = require('../models')

const users = async (req, res) => {
  const { search } = req.query
  const users = await db.User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.substring]: search } },
        { email: { [Op.substring]: search } },
      ],
      [Op.not]: [{ id: req.user.user_id }],
    },
  })
  res.status(StatusCodes.OK).json({ status: StatusCodes.OK, users })
}

module.exports = { users }
