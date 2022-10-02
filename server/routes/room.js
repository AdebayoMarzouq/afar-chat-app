const express = require('express')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')
const {
  getOrCreatePrivateRoom,
  createGroup,
  getRoomsAndGroups,
  getRoomByUUID,
  updateGroup,
  deleteGroup,
  addParticipantToGroup,
  removeParticipantFromGroup,
  leaveGroup
} = require('../controllers/room')

const router = express.Router()

router.route('/').post(checkIfUserIsAuthenticated, getOrCreatePrivateRoom)
router.route('/').get(checkIfUserIsAuthenticated, getRoomsAndGroups)
router.route('/:room_id').get(checkIfUserIsAuthenticated, getRoomByUUID)
router.route('/group').post(checkIfUserIsAuthenticated, createGroup)
router.route('/group/:room_id').delete(checkIfUserIsAuthenticated, deleteGroup)
router.route('/update').patch(checkIfUserIsAuthenticated, updateGroup)
router.route('/remove').delete(checkIfUserIsAuthenticated, removeParticipantFromGroup)
router.route('/add').post(checkIfUserIsAuthenticated, addParticipantToGroup)
router.route('/leave').delete(checkIfUserIsAuthenticated, leaveGroup)

module.exports = router