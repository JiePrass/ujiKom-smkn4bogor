const dashboardService = require('../services/dashboard.service')

exports.getSummary = async (req, res) => {
    try {
        const data = await dashboardService.getSummary()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getEventsPerMonth = async (req, res) => {
    try {
        const data = await dashboardService.getEventsPerMonth()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getAttendeesPerMonth = async (req, res) => {
    try {
        const data = await dashboardService.getAttendeesPerMonth()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getTopEvents = async (req, res) => {
    try {
        const data = await dashboardService.getTopEvents()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
