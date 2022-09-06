const express = require('express')
const { users } = require('../controllers/users')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')

const router = express.Router()

router.get('/', checkIfUserIsAuthenticated, users)

module.exports = router
