const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ message: error.message })
  }
  if ((error.name = 'SequelizeUniqueConstraintError')) {
    // return res.status(StatusCodes.BAD_REQUEST).json({error: error})
    return res.status(StatusCodes.BAD_REQUEST).json({ message: `${Object.keys(error.fields).join(', ')} already exists` })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: error.message, error: error, ...error })
}

const notFoundMiddleware = (req, res, next) => {
  const error = new CustomError(`Route not found - ${req.originalUrl}`, 404)
  next(error)
}

module.exports = { errorHandlerMiddleware, notFoundMiddleware }
