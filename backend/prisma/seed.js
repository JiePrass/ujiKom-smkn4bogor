const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
    const passwordHash = await bcrypt.hash("password123", 10)

    console.log("🔹 Menjalankan seeder...")

    // ===== Admin Seeder =====
    const admin = await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {},
        create: {
            fullName: "Admin User",
            email: "admin@example.com",
            phone: "081234567890",
            address: "Jakarta",
            education: "S1 Informatika",
            passwordHash,
            role: "ADMIN",
            isVerified: true,
        },
    })

    // ===== Peserta Seeder =====
    const participants = await Promise.all(
        Array.from({ length: 20 }).map((_, i) =>
            prisma.user.upsert({
                where: { email: `user${i + 1}@example.com` },
                update: {},
                create: {
                    fullName: `User ${i + 1}`,
                    email: `user${i + 1}@example.com`,
                    phone: `08123456789${i + 1}`,
                    address: i % 2 === 0 ? "Bandung" : "Surabaya",
                    education: i % 3 === 0 ? "SMA" : "S1",
                    passwordHash,
                    isVerified: true,
                },
            })
        )
    )

    // ===== Event Seeder =====
    const now = new Date()
    const year = now.getFullYear()

    const eventsData = []
    const locations = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali", "Semarang"]
    const prices = [0, 25000, 50000, 75000, 100000, 150000]

    for (let month = 0; month < 12; month++) {
        for (let j = 0; j < 2; j++) {
            const eventDate = new Date(year, month, Math.floor(Math.random() * 25) + 1)
            eventsData.push({
                title: `Event Bulan ${month + 1} - ${j + 1}`,
                description: `Kegiatan menarik bulan ${month + 1}`,
                date: eventDate,
                time: j === 0 ? "09:00" : "14:00",
                location: locations[(month + j) % locations.length],
                flyerUrl: `/uploads/flyers/event-${month + 1}-${j + 1}.jpg`,
                eventBannerUrl: `/uploads/banners/banner-${month + 1}-${j + 1}.jpg`,
                createdBy: admin.id,
                price: prices[(month + j) % prices.length],
                eventType: "Workshop",
            })
        }
    }

    await prisma.event.createMany({ data: eventsData })
    const allEvents = await prisma.event.findMany()

    // ===== Registration + Attendance + Certificate Seeder =====
    for (const user of participants) {
        const randomEvents = allEvents.filter(() => Math.random() > 0.5) // 50% ikut event

        for (const event of randomEvents) {
            const registration = await prisma.registration.create({
                data: {
                    userId: user.id,
                    eventId: event.id,
                    status: Math.random() > 0.2 ? "APPROVED" : "PENDING",
                    paymentProofUrl: `/uploads/payments/${user.id}-${event.id}.jpg`,
                },
            })

            if (event.date < now && registration.status === "APPROVED") {
                await prisma.attendance.create({
                    data: { registrationId: registration.id },
                })

                await prisma.certificate.create({
                    data: {
                        registrationId: registration.id,
                        url: `/uploads/certificates/${registration.id}.pdf`,
                    },
                })
            }
        }
    }

    // ===== Notification Seeder =====
    const notificationsData = []

    for (const user of participants) {
        const randomEvents = allEvents.filter(() => Math.random() > 0.7)
        for (const event of randomEvents) {
            notificationsData.push({
                userId: user.id,
                title: "Pengingat Event",
                message: `Pengingat: Anda terdaftar di ${event.title} pada ${event.date.toLocaleDateString()}`,
                type: "EVENT_REMINDER",
                isRead: Math.random() > 0.5,
                createdAt: new Date(event.date.getTime() - 3 * 24 * 60 * 60 * 1000),
            })
        }
    }

    notificationsData.push(
        {
            userId: admin.id,
            title: "Laporan Pendaftaran",
            message: "Ada 5 peserta baru mendaftar minggu ini",
            type: "SYSTEM",
            isRead: false,
        },
        {
            userId: admin.id,
            title: "Event Penuh",
            message: "Beberapa event sudah penuh kapasitas",
            type: "SYSTEM",
            isRead: true,
        }
    )

    if (notificationsData.length > 0) {
        await prisma.notification.createMany({ data: notificationsData })
    }

    // // ===== Gallery Seeder =====
    // for (const event of allEvents.slice(0, 10)) {
    //     for (let i = 0; i < 3; i++) {
    //         const user = participants[Math.floor(Math.random() * participants.length)]
    //         const gallery = await prisma.gallery.create({
    //             data: {
    //                 eventId: event.id,
    //                 userId: user.id,
    //                 caption: `Kenangan di ${event.title}`,
    //                 media: {
    //                     create: [
    //                         { mediaUrl: `/uploads/gallery/event${event.id}-user${user.id}-1.jpg` },
    //                         { mediaUrl: `/uploads/gallery/event${event.id}-user${user.id}-2.jpg` },
    //                     ],
    //                 },
    //             },
    //         })

    //         // Likes
    //         const likeUsers = participants.filter(() => Math.random() > 0.8)
    //         for (const liker of likeUsers) {
    //             await prisma.galleryLike.create({
    //                 data: {
    //                     galleryId: gallery.id,
    //                     userId: liker.id,
    //                 },
    //             })
    //         }

    //         // Comments
    //         const commentUsers = participants.filter(() => Math.random() > 0.7)
    //         for (const commenter of commentUsers) {
    //             const comment = await prisma.galleryComment.create({
    //                 data: {
    //                     galleryId: gallery.id,
    //                     userId: commenter.id,
    //                     content: `Komentar dari ${commenter.fullName} untuk ${event.title}`,
    //                 },
    //             })

    //             // Occasionally add replies and reports
    //             if (Math.random() > 0.8) {
    //                 await prisma.galleryComment.create({
    //                     data: {
    //                         galleryId: gallery.id,
    //                         userId: user.id,
    //                         content: `Balasan dari ${user.fullName}`,
    //                         parentId: comment.id,
    //                     },
    //                 })

    //                 await prisma.galleryCommentReport.create({
    //                     data: {
    //                         commentId: comment.id,
    //                         userId: admin.id,
    //                         reason: "Komentar tidak pantas",
    //                     },
    //                 })
    //             }
    //         }
    //     }
    // }

    console.log("✅ Seeder berhasil dijalankan sepenuhnya.")
}

main()
    .catch((e) => {
        console.error("❌ Seeder gagal:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
