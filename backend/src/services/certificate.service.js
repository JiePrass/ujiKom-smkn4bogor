const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const path = require('path')
const fs = require('fs')
const AdmZip = require('adm-zip')

const baseTempExtractDir = path.join(__dirname, '../../uploads/temp_extract')
const certificatesDir = path.join(__dirname, '../../uploads/certificates')

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function listFilesOnly(dir) {
    if (!fs.existsSync(dir)) return []
    return fs.readdirSync(dir).filter(f => {
        try {
            return fs.statSync(path.join(dir, f)).isFile()
        } catch {
            return false
        }
    })
}

exports.processBulkUpload = async (eventId, zipPath) => {
    const eventTempDir = path.join(baseTempExtractDir, String(eventId))

    // Bersihkan folder temp event sebelum ekstrak ZIP baru
    fs.rmSync(eventTempDir, { recursive: true, force: true })
    ensureDir(eventTempDir)

    // Ekstrak ZIP ke folder event
    const zip = new AdmZip(zipPath)
    zip.extractAllTo(eventTempDir, true)

    // Hapus file ZIP asli setelah ekstrak
    fs.unlinkSync(zipPath)

    const allFiles = listFilesOnly(eventTempDir)
    let matchedCount = 0
    const unmatchedFiles = []

    for (const file of allFiles) {
        const token = path.parse(file).name   // nama file tanpa ekstensi
        const filePath = path.join(eventTempDir, file)

        const registration = await prisma.registration.findFirst({
            where: { eventId: parseInt(eventId), token }
        })

        if (registration) {
            ensureDir(certificatesDir)
            const destFileName = `${registration.id}_${file}`
            const destPath = path.join(certificatesDir, destFileName)
            fs.renameSync(filePath, destPath)

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
                // ⬇️ gunakan path di bawah /uploads agar bisa diakses dari FE
                previewUrl: `/uploads/temp_extract/${eventId}/${file}`
            })
        }
    }

    return { matchedCount, unmatchedFiles }
}

exports.getUnmatchedFiles = async (eventId) => {
    const eventTempDir = path.join(baseTempExtractDir, String(eventId))
    const files = listFilesOnly(eventTempDir)
    return files.map(file => ({
        filename: file,
        previewUrl: `/uploads/temp_extract/${eventId}/${file}`
    }))
}

exports.mapCertificates = async (eventId, mappings) => {
    const eventTempDir = path.join(baseTempExtractDir, String(eventId))
    ensureDir(certificatesDir)

    for (const map of mappings) {
        const sourcePath = path.join(eventTempDir, map.filename)
        if (!fs.existsSync(sourcePath)) {
            console.warn(`File ${map.filename} tidak ditemukan di temp_extract/${eventId}`)
            continue
        }

        const destFileName = `${map.registrationId}_${map.filename}`
        const destPath = path.join(certificatesDir, destFileName)
        fs.renameSync(sourcePath, destPath)

        await prisma.certificate.upsert({
            where: { registrationId: parseInt(map.registrationId) },
            update: { url: `/uploads/certificates/${destFileName}` },
            create: {
                registrationId: parseInt(map.registrationId),
                url: `/uploads/certificates/${destFileName}`
            }
        })

    }

    try {
        if (fs.existsSync(eventTempDir) && listFilesOnly(eventTempDir).length === 0) {
            fs.rmSync(eventTempDir, { recursive: true, force: true })
        }
    } catch { }
}

exports.getCertificatesByEvent = async (eventId) => {
    return await prisma.certificate.findMany({
        where: { registration: { eventId: parseInt(eventId) } },
        include: {
            registration: {
                select: {
                    id: true,
                    user: { select: { fullName: true, email: true } },
                },
            },
        },
        orderBy: { id: "desc" },
    });
};

