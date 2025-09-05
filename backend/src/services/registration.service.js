const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Fungsi pembuat token pendek dan mudah diketik
function generateAlphanumericToken(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Hindari O/0, I/1
    let token = ''
    for (let i = 0; i < length; i++) {
        token += chars[Math.floor(Math.random() * chars.length)]
    }
    return token
}

exports.registerToEvent = async (eventId, req, user) => {
    const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) }
    })
    if (!event) throw new Error('Event tidak ditemukan.')

    const alreadyRegistered = await prisma.registration.findFirst({
        where: {
            userId: user.id,
            eventId: event.id
        }
    })
    if (alreadyRegistered) throw new Error('Anda sudah terdaftar di event ini.')

    let paymentProofUrl = null
    let status = 'APPROVED'
    let token = null

    if (event.price > 0) {
        const paymentProofFile = req.files?.paymentProof?.[0]
        if (!paymentProofFile) throw new Error('Bukti pembayaran wajib diunggah.')

        paymentProofUrl = `/uploads/payments/${paymentProofFile.filename}`
        status = 'PENDING'
    } else {
        token = generateAlphanumericToken(8)
    }

    const registration = await prisma.registration.create({
        data: {
            userId: user.id,
            eventId: event.id,
            paymentProofUrl,
            status,
            ...(token && { token })
        }
})

    return { message: 'Pendaftaran berhasil', registration }
}


exports.getRegistrationsByEvent = async (eventId) => {
    return await prisma.registration.findMany({
        where: { eventId: parseInt(eventId) },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }
    })
}


exports.updatePaymentStatus = async (registrationId, status) => {
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        throw new Error('Invalid status value')
    }

    const registration = await prisma.registration.findUnique({
        where: { id: parseInt(registrationId) },
        include: { event: true }
    })

    if (!registration) throw new Error('Registration not found')

    const updateData = { status }

    if (
        status === 'APPROVED' &&
        registration.event.price > 0 &&
        !registration.token
    ) {
        updateData.token = generateAlphanumericToken(8)
    }

    return await prisma.registration.update({
        where: { id: parseInt(registrationId) },
        data: updateData
    })
}

exports.checkUserRegistration = async (eventId, userId) => {
    const registration = await prisma.registration.findFirst({
        where: { eventId: parseInt(eventId), userId }
    })
    return !!registration // true jika sudah daftar
}

