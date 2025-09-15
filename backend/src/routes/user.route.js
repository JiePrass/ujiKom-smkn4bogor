const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const userController = require('../controllers/user.controller')
const requireUserId = require('../middlewares/requireUserId')
const upload = require('../middlewares/upload')

router.get('/:id', requireLogin, requireUserId, userController.getUserById);
router.patch(
    '/edit',
    requireLogin,
    requireUserId,
    upload.single('profilePicture'),
    userController.updateProfile
);

module.exports = router