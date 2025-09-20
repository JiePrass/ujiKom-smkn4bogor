const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Tentukan folder berdasarkan fieldname
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads'

        if (file.fieldname === 'flyer') folder = 'uploads/flyers'
        else if (file.fieldname === 'paymentProof') folder = 'uploads/payments'
        else if (file.fieldname === 'profilePicture') folder = 'uploads/profile-pictures'
        else if (file.fieldname === 'certificateFile') folder = 'uploads/certificates'
        else if (file.fieldname === 'zipFile') folder = 'uploads/temp'
        else if (file.fieldname === 'bannerUrl') folder = 'uploads/banner-profiles'
        else if (file.fieldname === 'eventBanner') folder = 'uploads/banner-events'

        // Pastikan folder ada
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })
        cb(null, folder)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, uniqueName + ext)
    }
})

const upload = multer({ storage })
module.exports = upload
