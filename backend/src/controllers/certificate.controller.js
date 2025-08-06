const certificateService = require('../services/certificate.service')

exports.bulkUploadCertificates = async (req, res) => {
    try {
        const { eventId } = req.params
        const zipPath = req.file?.path

        if (!zipPath) {
            return res.status(400).json({ error: 'File ZIP tidak ditemukan.' })
        }

        const result = await certificateService.processBulkUpload(eventId, zipPath)

        res.status(200).json({
            message: 'Proses upload selesai',
            matched: result.matchedCount,
            unmatched: result.unmatchedFiles
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

exports.getUnmatchedFiles = async (req, res) => {
    try {
        const { eventId } = req.params
        const unmatched = await certificateService.getUnmatchedFiles(eventId)

        res.status(200).json({ unmatched })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

exports.mapCertificates = async (req, res) => {
    try {
        const mappings = req.body // [{ filename, registrationId }]
        if (!Array.isArray(mappings) || mappings.length === 0) {
            return res.status(400).json({ error: 'Data mapping tidak valid.' })
        }

        await certificateService.mapCertificates(mappings)

        res.status(200).json({ message: 'Mapping sertifikat berhasil disimpan.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}
