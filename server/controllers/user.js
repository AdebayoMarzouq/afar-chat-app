const {CustomError} = require('../errors')
const { StatusCodes } = require('http-status-codes')
const db = require('../models')

const register_user = async (req, res) => {
  await db.User.create(req.body)
  res.status(StatusCodes.CREATED).json({ status: StatusCodes.CREATED })
}

const login_user = async (req, res) => {
  const { email, password } = req.body
  const user = await db.User.scope('withPassword').findOne({ where: { email } })
  if (!user) {
    throw new CustomError('This user does not exist', StatusCodes.BAD_REQUEST)
  }
  const isValid = await user.comparePasswords(password)
  if (!isValid) {
    throw new CustomError('Wrong password', StatusCodes.BAD_REQUEST)
  }
  const token = user.generateJWT()
  const userObj = {
    uuid: user.uuid,
    username: user.username,
    email: user.email,
    profile_image: user.profile_image,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
  res.status(StatusCodes.OK).json({ status: StatusCodes.OK, user: userObj, token })
}

module.exports = {
  register_user,
  login_user,
}
