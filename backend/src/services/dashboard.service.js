const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const normalizeBigInt = require('../utils/normalizeBigInt')

// Ringkasan dashboard
exports.getSummary = async () => {
    const totalEvents = await prisma.Event.count()
    const totalRegistrations = await prisma.Registration.count()
    const totalAttendees = await prisma.Attendance.count()

    const nearestEvent = await prisma.Event.findFirst({
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' },
        select: { id: true, title: true, date: true }
    })

    return {
        totalEvents,
        totalRegistrations,
        totalAttendees,
        nearestEvent
    }
}

exports.getEventsPerMonth = async () => {
    const raw = await prisma.$queryRaw`
        SELECT MONTH(date) as month, COUNT(*) as events
        FROM Event
        GROUP BY MONTH(date)
        ORDER BY MONTH(date)
    `
    
    const data = normalizeBigInt(raw)

    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const result = months.map(m => {
        const found = data.find(d => d.month === m)
        return { month: m, events: found ? found.events : 0 }
    })

    return result
}


exports.getAttendeesPerMonth = async () => {
    const raw = await prisma.$queryRaw`
        SELECT MONTH(e.date) as month, COUNT(a.id) as attendees
        FROM Attendance a
        JOIN Registration r ON a.registrationId = r.id
        JOIN Event e ON r.eventId = e.id
        GROUP BY MONTH(e.date)
        ORDER BY MONTH(e.date)
    `
    const data = normalizeBigInt(raw)

    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    const result = months.map(m => {
        const found = data.find(d => d.month === m)
        return { month: m, attendees: found ? found.attendees : 0 }
    })

    return result
}

exports.getTopEvents = async () => {
    const result = await prisma.$queryRaw`
        SELECT e.id, e.title, COUNT(r.id) as participants
        FROM Event e
        LEFT JOIN Registration r ON e.id = r.eventId
        GROUP BY e.id, e.title
        ORDER BY participants DESC
        LIMIT 10
    `
    return normalizeBigInt(result)
}

