const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.attendWithToken = async (token) => {
    const registration = await prisma.registration.findUnique({
        where: { token },
        include: {
            user: true,
            event: true
        }
    })

    if (!registration) throw new Error('Token tidak valid.')

    if (registration.status !== 'APPROVED') {
        throw new Error('Presensi hanya dapat dilakukan jika pembayaran pendaftaran telah diverifikasi.');
    }

    const existing = await prisma.attendance.findUnique({
        where: { registrationId: registration.id }
    })

    if (existing) throw new Error('Presensi sudah tercatat.')

    await prisma.attendance.create({
        data: {
            registrationId: registration.id
        }
    })

    return { message: 'Presensi berhasil dicatat.' }
}
