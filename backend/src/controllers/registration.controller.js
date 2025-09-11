const registrationService = require('../services/registration.service')

exports.register = async (req, res) => {
    try {
        const { eventId } = req.params
        const result = await registrationService.registerToEvent(eventId, req, req.user)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.getRegistrationsByEvent = async (req, res) => {
    const { eventId } = req.params

    try {
        const registrations = await registrationService.getRegistrationsByEvent(eventId)
        res.status(200).json(registrations)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.updatePaymentStatus = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const updated = await registrationService.updatePaymentStatus(id, status)
        res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

exports.checkUserRegistration = async (req, res) => {
    const { eventId } = req.params
    const userId = req.user.id

    try {
        const isRegistered = await registrationService.checkUserRegistration(eventId, userId)
        res.status(200).json({ isRegistered })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.exportRegistrationsCSV = async (req, res) => {
    try {
        const { eventId } = req.params;
        const csv = await registrationService.exportRegistrationsCSV(eventId);

        res.header("Content-Type", "text/csv");
        res.attachment(`registrations-event-${eventId}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
