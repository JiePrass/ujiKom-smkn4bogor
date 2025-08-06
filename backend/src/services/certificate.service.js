const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')

exports.processBulkUpload = async (eventId, zipPath) => {
    const tempExtractDir = path.join(__dirname, '../../uploads/temp_extract')

    // Pastikan folder ekstrak ada
    if (!fs.existsSync(tempExtractDir)) {
        fs.mkdirSync(tempExtractDir, { recursive: true })
    }

    // Ekstrak ZIP
    const zip = new AdmZip(zipPath)
    zip.extractAllTo(tempExtractDir, true)

    // Hapus file ZIP asli setelah ekstrak
    fs.unlinkSync(zipPath)

    const allFiles = fs.readdirSync(tempExtractDir)
    let matchedCount = 0
    const unmatchedFiles = []

    for (const file of allFiles) {
        const token = path.parse(file).name // ambil nama file tanpa ekstensi
        const filePath = path.join(tempExtractDir, file)

        const registration = await prisma.registration.findFirst({
            where: {
                eventId: parseInt(eventId),
                token: token
            }
        })

        if (registration) {
            // Pindahkan file ke folder certificates
            const destFolder = path.join(__dirname, '../../uploads/certificates')
            if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true })

            const destFileName = `${registration.id}_${file}`
            const destPath = path.join(destFolder, destFileName)
            fs.renameSync(filePath, destPath)

            // Simpan ke DB
            await prisma.certificate.create({
                data: {
                    registrationId: registration.id,
                    url: `/uploads/certificates/${destFileName}`
                }
            })

            matchedCount++
        } else {
            unmatchedFiles.push({
                filename: file,
                previewUrl: `/temp_extract/${file}`
            })
        }
    }

    return { matchedCount, unmatchedFiles }
}

const tempExtractDir = path.join(__dirname, '../../uploads/temp_extract')
const certificatesDir = path.join(__dirname, '../../uploads/certificates')

exports.getUnmatchedFiles = async (eventId) => {
    // Baca file dari folder temp_extract
    if (!fs.existsSync(tempExtractDir)) return []

    const files = fs.readdirSync(tempExtractDir)

    // Hanya kirim info filename & previewUrl
    return files.map(file => ({
        filename: file,
        previewUrl: `/temp_extract/${file}`
    }))
}

exports.mapCertificates = async (mappings) => {
    if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true })
    }

    for (const map of mappings) {
        const sourcePath = path.join(tempExtractDir, map.filename)
        if (!fs.existsSync(sourcePath)) {
            console.warn(`File ${map.filename} tidak ditemukan di temp_extract`)
            continue
        }

        const destFileName = `${map.registrationId}_${map.filename}`
        const destPath = path.join(certificatesDir, destFileName)

        // Pindahkan file
        fs.renameSync(sourcePath, destPath)

        // Simpan ke DB
        await prisma.certificate.create({
            data: {
                registrationId: parseInt(map.registrationId),
                url: `/uploads/certificates/${destFileName}`
            }
        })
    }
}
