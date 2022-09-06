const { Op } = require('sequelize')
const { StatusCodes } = require('http-status-codes')
const db = require('../models')

const users = async (req, res) => {
  const { search } = req.query
  console.log(search)
  console.log(req.user || undefined)
  const users = await db.User.findAll({
    where: {
      [Op.or]: [{ username: search }, { email: search }],
      [Op.not]: [{ user_id: req.user.user_id }],
    },
  })
  res.status(StatusCodes.OK).json({ status: StatusCodes.OK, users })
}

module.exports = { users }
