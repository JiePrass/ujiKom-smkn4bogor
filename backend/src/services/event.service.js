const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs')

exports.getAllEvents = async () => {
    const events = await prisma.event.findMany({
        orderBy: {
            date: 'asc'
        },
        include: {
            _count: {
                select: {
                    registrations: true
                }
            }
        }
    })

    return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        flyerUrl: event.flyerUrl,
        price: event.price, // ← tambahkan ini
        participantCount: event._count.registrations
    }))
}

exports.getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            _count: {
                select: { registrations: true }
            },
            createdByUser: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        }
    })

    if (!event) throw new Error('Event tidak ditemukan.')

    return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        flyerUrl: event.flyerUrl,
        certificateTemplateUrl: event.certificateTemplateUrl,
        price: event.price, // ← tambahkan ini
        participantCount: event._count.registrations,
        createdBy: event.createdByUser
    }
}

exports.createEvent = async (req, user) => {
    const {
        title,
        description,
        date,
        time,
        location,
        price = 0
    } = req.body

    const flyerFile = req.files['flyer']?.[0]
    const flyerUrl = flyerFile ? `/uploads/flyers/${flyerFile.filename}` : null

    // Validasi H-3
    const eventDate = dayjs(date)
    const today = dayjs()
    if (eventDate.diff(today, 'day') < 3) {
        throw new Error('Event hanya bisa dibuat minimal H-3 dari tanggal pelaksanaan.')
    }

    const event = await prisma.event.create({
        data: {
            title,
            description,
            date: new Date(date),
            time,
            location,
            price: parseInt(price),
            flyerUrl,
            createdBy: user.id
        }
    })

    return { message: 'Event berhasil dibuat', event }
}
