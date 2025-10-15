const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const dayjs = require('dayjs')
const cloudinary = require('cloudinary').v2

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/** =======================
 *  GET ALL EVENTS
 *  ======================= */
exports.getAllEvents = async () => {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
        include: {
            _count: { select: { registrations: true } },
        },
    })

    return events.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        description: event.description,
        time: event.time,
        location: event.location,
        flyerUrl: event.flyerUrl,
        eventBannerUrl: event.eventBannerUrl,
        eventType: event.eventType,
        price: event.price,
    }))
}

/** =======================
 *  GET EVENT DETAIL
 *  ======================= */
exports.getEventById = async (id) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            _count: { select: { registrations: true } },
            createdByUser: { select: { id: true, fullName: true, email: true } },
        },
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
        eventBannerUrl: event.eventBannerUrl,
        eventType: event.eventType,
        certificateTemplateUrl: event.certificateTemplateUrl,
        price: event.price,
        participantCount: event._count.registrations,
        createdBy: event.createdByUser,
    }
}

/** =======================
 *  CREATE EVENT
 *  ======================= */
exports.createEvent = async (req, user) => {
    const { title, description, date, time, location, eventType, price = 0 } = req.body;

    const eventDate = dayjs(date);
    const today = dayjs();
    if (eventDate.diff(today, "day") < 3) {
        throw new Error("Event hanya bisa dibuat minimal H-3 dari tanggal pelaksanaan.");
    }

    // Cloudinary sudah handle upload lewat multer-storage-cloudinary
    const flyerUrl = req.files?.flyer?.[0]?.path || null;
    const eventBannerUrl = req.files?.eventBanner?.[0]?.path || null;

    const event = await prisma.event.create({
        data: {
            title,
            description,
            date: new Date(date),
            time,
            location,
            price: parseInt(price),
            flyerUrl,
            eventBannerUrl,
            eventType,
            createdBy: user.id,
        },
    });

    return { message: "Event berhasil dibuat", event };
};

/** =======================
 *  UPDATE EVENT
 *  ======================= */
exports.updateEvent = async (req, user) => {
    const { id } = req.params
    const { title, description, date, time, location, price, eventType } = req.body

    const existingEvent = await prisma.event.findUnique({ where: { id: parseInt(id) } })
    if (!existingEvent) throw new Error('Event tidak ditemukan.')

    if (user.role !== 'ADMIN' && user.id !== existingEvent.createdBy) {
        throw new Error('Tidak memiliki izin untuk mengedit event ini.')
    }

    const now = dayjs().startOf('day')
    const currentEventDate = dayjs(existingEvent.date).startOf('day')

    if (currentEventDate.isSame(now)) throw new Error('Event sedang berlangsung dan tidak dapat diedit.')
    if (currentEventDate.isBefore(now)) throw new Error('Event telah selesai dan tidak dapat diedit.')

    const newEventDate = date ? dayjs(date) : currentEventDate
    if (newEventDate.diff(now, 'day') < 3) {
        throw new Error('Event hanya bisa diedit minimal H-3 dari tanggal pelaksanaan.')
    }

    // Upload file baru ke Cloudinary (hapus lama jika perlu)
    let flyerUrl = existingEvent.flyerUrl
    if (req.files?.flyer?.[0]) {
        if (flyerUrl) {
            const publicId = extractPublicId(flyerUrl)
            await cloudinary.uploader.destroy(publicId)
        }
        const uploadResult = await cloudinary.uploader.upload(req.files.flyer[0].path, {
            folder: 'simkas/flyers',
            resource_type: 'image',
        })
        flyerUrl = uploadResult.secure_url
    }

    let eventBannerUrl = existingEvent.eventBannerUrl
    if (req.files?.eventBanner?.[0]) {
        if (eventBannerUrl) {
            const publicId = extractPublicId(eventBannerUrl)
            await cloudinary.uploader.destroy(publicId)
        }
        const uploadResult = await cloudinary.uploader.upload(req.files.eventBanner[0].path, {
            folder: 'simkas/banner-events',
            resource_type: 'image',
        })
        eventBannerUrl = uploadResult.secure_url
    }

    const updatedEvent = await prisma.event.update({
        where: { id: parseInt(id) },
        data: {
            title: title ?? existingEvent.title,
            description: description ?? existingEvent.description,
            date: date ? new Date(date) : existingEvent.date,
            time: time ?? existingEvent.time,
            location: location ?? existingEvent.location,
            price: price !== undefined ? parseInt(price) : existingEvent.price,
            flyerUrl,
            eventBannerUrl,
            eventType: eventType ?? existingEvent.eventType,
        },
    })

    return { message: 'Event berhasil diperbarui', event: updatedEvent }
}

/** =======================
 *  DELETE EVENT
 *  ======================= */
exports.deleteEvent = async (id, user) => {
    const eventId = parseInt(id)
    const event = await prisma.event.findUnique({ where: { id: eventId } })
    if (!event) throw new Error('Event tidak ditemukan.')

    if (user.role !== 'ADMIN' && user.id !== event.createdBy) {
        throw new Error('Tidak memiliki izin untuk menghapus event ini.')
    }

    // Hapus file dari Cloudinary jika ada
    if (event.flyerUrl) {
        const publicId = extractPublicId(event.flyerUrl)
        await cloudinary.uploader.destroy(publicId)
    }
    if (event.eventBannerUrl) {
        const publicId = extractPublicId(event.eventBannerUrl)
        await cloudinary.uploader.destroy(publicId)
    }

    // Hapus relasi data
    await prisma.certificate.deleteMany({
        where: { registration: { eventId } },
    })
    await prisma.attendance.deleteMany({
        where: { registration: { eventId } },
    })
    await prisma.registration.deleteMany({
        where: { eventId },
    })

    await prisma.event.delete({ where: { id: eventId } })
    return { message: 'Event berhasil dihapus' }
}

/** =======================
 *  Helper: Extract Cloudinary public_id
 *  ======================= */
function extractPublicId(url) {
    const parts = url.split('/')
    const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/')
    return folderAndFile.split('.')[0]
}
