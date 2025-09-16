const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            createdEvents: true,
            registrations: {
                include: {
                    event: true,
                    certificate: true,
                },
            },
        },
    })

    if (!user) return null

    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        education: user.education,
        profilePicture: user.profilePicture,
        bannerUrl: user.bannerUrl,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,

        // Event yang diikuti user
        events: user.registrations.map((reg) => reg.event),

        // Sertifikat yang dimiliki user
        certificates: user.registrations
        .filter((reg) => reg.certificate)
        .map((reg) => ({
            id: reg.certificate.id,
            issuedAt: reg.certificate.issuedAt,
            url: reg.certificate.url,
            eventId: reg.event.id,
            eventTitle: reg.event.title,
            eventDate: reg.event.date,
        })),
    }
}

exports.updateProfile = async (userId, data) => {
    return await prisma.user.update({
        where: { id: userId },
        data,
    });
};