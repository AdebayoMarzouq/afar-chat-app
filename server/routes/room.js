const express = require('express')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')
const {room, getRooms, group, updateRoom, addParticipant, removeParticipant} = require('../controllers/room')

const router = express.Router()

router.route('/').post(checkIfUserIsAuthenticated, room)
router.route('/').get(checkIfUserIsAuthenticated, getRooms)
router.route('/group').post(checkIfUserIsAuthenticated, group)
router.route('/update').patch(checkIfUserIsAuthenticated, updateRoom)
router.route('/remove').post(checkIfUserIsAuthenticated, removeParticipant)
router.route('/add').post(checkIfUserIsAuthenticated, addParticipant)

module.exports = router