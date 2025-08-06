const eventService = require('../services/event.service')

exports.getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents()
        res.status(200).json(events)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(parseInt(req.params.id))
        res.status(200).json(event)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

exports.createEvent = async (req, res) => {
    try {
        const response = await eventService.createEvent(req, req.user)
        res.status(201).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const response = await eventService.updateEvent(req, req.user)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.deleteEvent = async (req, res) => {
    try {
        const response = await eventService.deleteEvent(req.params.id, req.user)
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

