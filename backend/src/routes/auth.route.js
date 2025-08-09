const express = require('express')
const router = express.Router()
const requireLogin = require('../middlewares/requireLogin')
const authController = require('../controllers/auth.controller')
const requireUserId = require('../middlewares/requireUserId')
const upload = require('../middlewares/upload')

router.post('/register', authController.register)
router.post('/verify-email', authController.verifyEmail)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', requireLogin, requireUserId, authController.me)
router.patch(
    '/edit',
    requireLogin,
    requireUserId,
    upload.single('profilePicture'),
    authController.updateProfile
);

module.exports = router
