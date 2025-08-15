const express = require('express')
const router = express.Router()
const registrationController = require('../controllers/registration.controller')
const requireLogin = require('../middlewares/requireLogin')
const requireRole = require('../middlewares/requireRole')
const upload = require('../middlewares/upload')

// Get all registrations for a specific event (admin only)
router.get(
    '/event/:eventId',
    requireLogin,
    requireRole('ADMIN'),
    registrationController.getRegistrationsByEvent
)

// Register for an event
router.post(
    '/:eventId',
    requireLogin,
    upload.fields([{ name: 'paymentProof', maxCount: 1 }]),
    registrationController.register
)

// Update payment status by admin
router.patch(
    '/:id/payment-status',
    requireLogin,
    requireRole('ADMIN'),
    registrationController.updatePaymentStatus
)

// Check if user is registered for an event
router.get(
    '/:eventId/check', requireLogin, registrationController.checkUserRegistration)

module.exports = router
