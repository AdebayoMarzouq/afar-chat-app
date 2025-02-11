const jwt = require('jsonwebtoken')
const db = require('../models')
const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const checkIfUserIsAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError(
      'Invalid authentication token',
      StatusCodes.BAD_REQUEST
    )
  }
  try {
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await db.User.scope('withId').findOne({
      where: {uuid: payload.user_id},
      attributes: ['id', 'uuid', 'email'],
    })
    req.user = {
      id: user.id,
      user_id: user.uuid,
      email: user.email,
    }
    next()
  } catch (error) {
    throw new CustomError(
      'Authentication error, invalid token',
      StatusCodes.BAD_REQUEST
    )
  }
}

module.exports = {
  checkIfUserIsAuthenticated,
}