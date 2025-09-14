const path = require('path')
const fs = require('fs')
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
        price: event.price,
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
        price: event.price,
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

exports.updateEvent = async (req, user) => {
    const { id } = req.params
    const {
        title,
        description,
        date,
        time,
        location,
        price
    } = req.body

    // Cari event
    const existingEvent = await prisma.event.findUnique({ where: { id: parseInt(id) } })
    if (!existingEvent) throw new Error('Event tidak ditemukan.')

    // Hanya admin yang bisa edit
    if (user.role !== 'ADMIN' && user.id !== existingEvent.createdBy) {
        throw new Error('Tidak memiliki izin untuk mengedit event ini.')
    }

    const now = dayjs().startOf('day')
    const currentEventDate = dayjs(existingEvent.date).startOf('day')

    // Cek apakah event sedang berlangsung
    if (currentEventDate.isSame(now)) {
        throw new Error('Event sedang berlangsung dan tidak dapat diedit.')
    }

    // Cek apakah event sudah selesai
    if (currentEventDate.isBefore(now)) {
        throw new Error('Event telah selesai dan tidak dapat diedit.')
    }

    // Validasi H-3
    const newEventDate = date ? dayjs(date) : currentEventDate
    if (newEventDate.diff(now, 'day') < 3) {
        throw new Error('Event hanya bisa diedit minimal H-3 dari tanggal pelaksanaan.')
    }

    // Validasi H-3
    const eventDate = date ? dayjs(date) : dayjs(existingEvent.date)
    const today = dayjs()
    if (eventDate.diff(today, 'day') < 3) {
        throw new Error('Event hanya bisa diedit minimal H-3 dari tanggal pelaksanaan.')
    }

    // Handle flyer update
    let flyerUrl = existingEvent.flyerUrl
    const flyerFile = req.files?.['flyer']?.[0]
    if (flyerFile) {
        // Hapus file lama
        if (flyerUrl) {
            const oldPath = path.resolve(process.cwd(), 'uploads', 'flyers', path.basename(flyerUrl))
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }
        flyerUrl = `/uploads/flyers/${flyerFile.filename}`
    }

    // Update event
    const updatedEvent = await prisma.event.update({
        where: { id: parseInt(id) },
        data: {
            title: title ?? existingEvent.title,
            description: description ?? existingEvent.description,
            date: date ? new Date(date) : existingEvent.date,
            time: time ?? existingEvent.time,
            location: location ?? existingEvent.location,
            price: price !== undefined ? parseInt(price) : existingEvent.price,
            flyerUrl
        }
    })

    return { message: 'Event berhasil diperbarui', event: updatedEvent }
}

exports.deleteEvent = async (id, user) => {
    const eventId = parseInt(id)

    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new Error('Event tidak ditemukan.')

    if (user.role !== 'ADMIN' && user.id !== event.createdBy) {
        throw new Error('Tidak memiliki izin untuk menghapus event ini.')
    }

    // Hapus flyer jika ada
    if (event.flyerUrl) {
        const flyerPath = path.resolve(process.cwd(), 'uploads', 'flyers', path.basename(event.flyerUrl))
        if (fs.existsSync(flyerPath)) {
            fs.unlinkSync(flyerPath)
        }
    }

    // Hapus semua relasi terlebih dahulu
    await prisma.certificate.deleteMany({
        where: {
            registration: {
                eventId
            }
        }
    })

    await prisma.attendance.deleteMany({
        where: {
            registration: {
                eventId
            }
        }
    })

    await prisma.registration.deleteMany({
        where: { eventId }
    })

    // Terakhir hapus event
    await prisma.event.delete({ where: { id: eventId } })

    return { message: 'Event berhasil dihapus' }
}

