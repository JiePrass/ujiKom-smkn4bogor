const attendanceService = require('../services/attendance.service')

exports.attend = async (req, res) => {
    try {
        const { token } = req.body
        if (!token) throw new Error('Token presensi wajib diisi.')

        const result = await attendanceService.attendWithToken(token)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
