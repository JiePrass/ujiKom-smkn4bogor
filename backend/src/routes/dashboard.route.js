const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')
const requireLogin = require('../middlewares/requireLogin')
const requireRole = require('../middlewares/requireRole')

router.get('/summary', requireLogin, requireRole("ADMIN"), dashboardController.getSummary)

router.get('/events-per-month', requireLogin, requireRole("ADMIN"), dashboardController.getEventsPerMonth)

router.get('/attendees-per-month', requireLogin, requireRole("ADMIN"), dashboardController.getAttendeesPerMonth)

router.get('/top-events', requireLogin, requireRole("ADMIN"), dashboardController.getTopEvents)

module.exports = router
