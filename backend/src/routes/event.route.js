const express = require('express')
const router = express.Router()
const eventController = require('../controllers/event.controller')
const attendanceController = require('../controllers/attendance.controller')
const requireLogin = require('../middlewares/requireLogin')
const requireRole = require('../middlewares/requireRole')
const upload = require('../middlewares/upload')

// Get all events
router.get('/', eventController.getAllEvents)

// Get detail event
router.get('/:id', eventController.getEventById)

// Create event (admin only)
router.post(
    '/',
    requireLogin,
    requireRole('ADMIN'),
    upload.fields([{ name: 'flyer', maxCount: 1 }]),
    eventController.createEvent
)

// Update event
router.patch(
    '/:id',
    requireLogin,
    upload.fields([{ name: 'flyer', maxCount: 1 }]),
    eventController.updateEvent
)

// Delete event
router.delete(
    '/:id',
    requireLogin,
    eventController.deleteEvent
)

// Attend (presensi peserta)
router.post(
    '/:eventId/attend',
    requireLogin,
    attendanceController.attend
)

module.exports = router
