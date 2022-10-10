const express = require('express')
const { register_user, login_user } = require('../controllers/user')

const router = express.Router()

router.route('/register').post(register_user)
router.post('/login', login_user)

module.exports = router