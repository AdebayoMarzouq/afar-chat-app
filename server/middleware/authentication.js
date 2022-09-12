const jwt = require('jsonwebtoken')
const db = require('../models')
const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const checkIfUserIsAuthenticated = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError(
      'Invalid authentication token',
      StatusCodes.UNAUTHORIZED
    )
  }
  try {
    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await db.User.findByPk(payload.user_id, {
      attributes: ['id', 'email'],
    })
    req.user = {
      user_id: user.id,
      email: user.email,
    }
    next()
  } catch (error) {
    throw new CustomError(
      'Authentication error, invalid token',
      StatusCodes.UNAUTHORIZED
    )
  }
}

module.exports = {
  checkIfUserIsAuthenticated,
}