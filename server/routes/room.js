const express = require('express')
const { checkIfUserIsAuthenticated } = require('../middleware/authentication')
const {
  getOrCreatePrivateRoom,
  createGroup,
  getRoomsAndGroups,
  updateGroup,
  addParticipantToGroup,
  removeParticipantFromGroup,
} = require('../controllers/room')

const router = express.Router()

router.route('/').post(checkIfUserIsAuthenticated, getOrCreatePrivateRoom)
router.route('/').get(checkIfUserIsAuthenticated, getRoomsAndGroups)
router.route('/group').post(checkIfUserIsAuthenticated, createGroup)
router.route('/update').patch(checkIfUserIsAuthenticated, updateGroup)
router.route('/remove').post(checkIfUserIsAuthenticated, removeParticipantFromGroup)
router.route('/add').post(checkIfUserIsAuthenticated, addParticipantToGroup)

module.exports = router