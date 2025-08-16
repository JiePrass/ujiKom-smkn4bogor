const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

  // Admin
    const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
        fullName: 'Admin User',
        email: 'admin@example.com',
        phone: '081234567890',
        address: 'Jakarta',
        education: 'S1 Informatika',
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
    },
});

  // Peserta
    const participants = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
        prisma.user.upsert({
        where: { email: `user${i + 1}@example.com` },
        update: {},
        create: {
            fullName: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            phone: `08123456789${i + 1}`,
            address: 'Bandung',
            education: 'SMA',
            passwordHash,
            isVerified: true,
            },
        })
    )
);

const now = new Date();
const pastDate = new Date(now);
pastDate.setDate(now.getDate() - 5);
const futureDate = new Date(now);
futureDate.setDate(now.getDate() + 5);

  // Events
await prisma.event.createMany({
        data: [
        {
            title: 'Event Selesai 1',
            description: 'Event yang sudah lewat',
            date: pastDate,
            time: '10:00',
            location: 'Jakarta',
            flyerUrl: '/uploads/flyers/event1.jpg',
            createdBy: admin.id,
            price: 0,
        },
        {
            title: 'Event Selesai 2',
            description: 'Event yang sudah lewat',
            date: pastDate,
            time: '13:00',
            location: 'Bandung',
            flyerUrl: '/uploads/flyers/event2.jpg',
            createdBy: admin.id,
            price: 0,
        },
        {
            title: 'Event Hari Ini 1',
            description: 'Event sedang berlangsung',
            date: now,
            time: '09:00',
            location: 'Surabaya',
            flyerUrl: '/uploads/flyers/event3.jpg',
            createdBy: admin.id,
            price: 50000,
        },
        {
            title: 'Event Hari Ini 2',
            description: 'Event sedang berlangsung',
            date: now,
            time: '15:00',
            location: 'Yogyakarta',
            flyerUrl: '/uploads/flyers/event4.jpg',
            createdBy: admin.id,
            price: 0,
        },
        {
            title: 'Event Mendatang 1',
            description: 'Event masa depan',
            date: futureDate,
            time: '10:00',
            location: 'Bali',
            flyerUrl: '/uploads/flyers/event5.jpg',
            createdBy: admin.id,
            price: 100000,
        },
        {
            title: 'Event Mendatang 2',
            description: 'Event masa depan',
            date: futureDate,
            time: '14:00',
            location: 'Semarang',
            flyerUrl: '/uploads/flyers/event6.jpg',
            createdBy: admin.id,
            price: 0,
        },
        ],
    });

    const allEvents = await prisma.event.findMany();

    for (const user of participants) {
        for (const event of allEvents.filter(e => e.title.includes('Selesai'))) {
        const registration = await prisma.registration.create({
            data: {
            userId: user.id,
            eventId: event.id,
            status: 'approved',
            },
        });

        await prisma.attendance.create({
            data: { registrationId: registration.id },
        });

        await prisma.certificate.create({
            data: {
            registrationId: registration.id,
            url: `/uploads/certificates/${registration.id}.pdf`,
            },
        });
        }
    }

    console.log('✅ Seeder selesai');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
