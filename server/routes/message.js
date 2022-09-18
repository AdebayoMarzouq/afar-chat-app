const express = require('express')
const { sendMessage } = require('../controllers/message')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')

const router = express.Router()

router.route('/').post(checkIfUserIsAuthenticated, sendMessage)
// router.route('/:room_id').get(checkIfUserIsAuthenticated, sendMessage)

module.exports = router
