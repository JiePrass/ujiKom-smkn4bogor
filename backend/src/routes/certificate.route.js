const express = require('express')
const router = express.Router()
const certificateController = require('../controllers/certificate.controller')
const requireLogin = require('../middlewares/requireLogin')
const requireRole = require('../middlewares/requireRole')
const uploadLocal = require('../middlewares/uploadLocal')

// Bulk upload sertifikat via ZIP (admin only)
router.post(
    '/bulk/:eventId',
    requireLogin,
    requireRole('ADMIN'),
    uploadLocal.single('zipFile'),
    certificateController.bulkUploadCertificates
)

// Ambil daftar unmatched files untuk event tertentu
router.get(
    '/unmatched/:eventId',
    requireLogin,
    requireRole('ADMIN'),
    certificateController.getUnmatchedFiles
)

// Simpan mapping manual untuk unmatched files
router.post(
    '/map/:eventId',
    requireLogin,
    requireRole('ADMIN'),
    certificateController.mapCertificates
)

// Ambil Sertifikat
router.get("/:eventId", 
    requireLogin, requireRole('ADMIN'), 
    certificateController.getCertificatesByEvent
);

module.exports = router
