const { PrismaClient } = require('@prisma/client');
const { Parser } = require("json2csv");
const cloudinary = require('cloudinary').v2;
const prisma = new PrismaClient();

// === Konfigurasi Cloudinary ===
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === Fungsi pembuat token pendek ===
function generateAlphanumericToken(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Hindari O/0, I/1
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

// === Fungsi utama registrasi event ===
exports.registerToEvent = async (eventId, req, user) => {
    const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) }
    });
    if (!event) throw new Error('Event tidak ditemukan.');

    const alreadyRegistered = await prisma.registration.findFirst({
        where: { userId: user.id, eventId: event.id }
    });
    if (alreadyRegistered) throw new Error('Anda sudah terdaftar di event ini.');

    let paymentProofUrl = null;
    let status = 'APPROVED';
    let token = null;

    // === Jika event berbayar, upload bukti pembayaran ke Cloudinary ===
    if (event.price > 0) {
        const paymentProofFile = req.files?.paymentProof?.[0];
        if (!paymentProofFile) throw new Error('Bukti pembayaran wajib diunggah.');

        try {
            // Upload ke Cloudinary dengan folder terstruktur
            const uploadResult = await cloudinary.uploader.upload(paymentProofFile.path, {
                folder: `simkas/payments/${event.id}`,
                use_filename: true,
                unique_filename: true,
                resource_type: "image"
            });

            paymentProofUrl = uploadResult.secure_url;
            status = 'PENDING';
        } catch (err) {
            console.error("Cloudinary upload failed:", err);
            throw new Error('Gagal mengunggah bukti pembayaran.');
        }
    } else {
        token = generateAlphanumericToken(8);
    }

    // === Simpan data registrasi ke database ===
    const registration = await prisma.registration.create({
        data: {
            userId: user.id,
            eventId: event.id,
            paymentProofUrl,
            status,
            ...(token && { token })
        }
    });

    return { message: 'Pendaftaran berhasil', registration };
};

// === Ambil semua registrasi per event ===
exports.getRegistrationsByEvent = async (eventId) => {
    return await prisma.registration.findMany({
        where: { eventId: parseInt(eventId) },
        include: { user: true }
    });
};

// === Ekspor data peserta ke CSV ===
exports.exportRegistrationsCSV = async (eventId) => {
    const registrations = await exports.getRegistrationsByEvent(eventId);

    if (!registrations || registrations.length === 0) {
        throw new Error("Tidak ada data registrasi");
    }

    const fields = [
        { label: "Full Name", value: "user.fullName" },
        { label: "Email", value: "user.email" },
        { label: "Phone", value: "user.phone" },
        { label: "Status Pembayaran", value: "status" },
        { label: "Kehadiran", value: (row) => (row.isAttended ? "Hadir" : "Tidak Hadir") },
        { label: "Token", value: "token" },
    ];

    const parser = new Parser({ fields, delimiter: ";" });
    let csv = parser.parse(registrations);
    csv = csv.replace(/\n/g, "\r\n");
    return "\uFEFF" + csv;
};

// === Update status pembayaran ===
exports.updatePaymentStatus = async (registrationId, status) => {
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        throw new Error('Invalid status value');
    }

    const registration = await prisma.registration.findUnique({
        where: { id: parseInt(registrationId) },
        include: { event: true }
    });

    if (!registration) throw new Error('Registration not found');

    const updateData = { status };

    if (
        status === 'APPROVED' &&
        registration.event.price > 0 &&
        !registration.token
    ) {
        updateData.token = generateAlphanumericToken(8);
    }

    return await prisma.registration.update({
        where: { id: parseInt(registrationId) },
        data: updateData
    });
};

// === Cek apakah user sudah terdaftar ===
exports.checkUserRegistration = async (eventId, userId) => {
    const registration = await prisma.registration.findFirst({
        where: { eventId: parseInt(eventId), userId }
    });
    return !!registration;
};
