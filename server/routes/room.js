const express = require('express')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')
const {room} = require('../controllers/room')

const router = express.Router()

router.route('/').post(checkIfUserIsAuthenticated, room)
// router.route('/').get(checkIfUserIsAuthenticated, getChat)
// router.route('/group').post(checkIfUserIsAuthenticated, createGroupChat)
// router.route('/update').patch(checkIfUserIsAuthenticated, updateGroupChat)
// router.route('/remove').patch(checkIfUserIsAuthenticated, removeParticipant)
// router.route('/add').patch(checkIfUserIsAuthenticated, addParticipant)

module.exports = router