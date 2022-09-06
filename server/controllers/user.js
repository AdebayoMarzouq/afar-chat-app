const bcrypt = require('bcrypt');
const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const db = require('../models')

const register_user = async (req, res) => {
  let user = await db.User.create(req.body)
  res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED, user  })
}

const login_user = async (req, res) => {
  const { email, password } = req.body
  const user = await db.User.findOne({ where: { email } })
  if (!user) {
    return res.send('This user does not exist')
  }
  const isValid = user.comparePasswords(password)
  if (!isValid) {
    throw new CustomError('Wrong password', StatusCodes.UNAUTHORIZED)
  }
  const token = user.generateJWT()
  res.status(StatusCodes.OK).json({ status: StatusCodes.OK, user, token })
}

module.exports = {
  register_user, login_user
}