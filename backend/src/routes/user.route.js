const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const userController = require('../controllers/user.controller')
const requireUserId = require('../middlewares/requireUserId')
const upload = require('../middlewares/upload')

router.get('/:id', requireLogin, requireUserId, userController.getUserById);
router.patch(
    '/edit/:id',
    requireLogin,
    requireUserId,
    upload.fields([
        { name: 'profilePicture', maxCount: 1 },
        { name: 'bannerUrl', maxCount: 1 },
    ]),
    userController.updateProfile
);

module.exports = router