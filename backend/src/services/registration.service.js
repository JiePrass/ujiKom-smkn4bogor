const { PrismaClient } = require('@prisma/client');
const { Parser } = require("json2csv");
const cloudinary = require('cloudinary').v2;
const mailer = require('../utils/mailer');
const prisma = new PrismaClient();
const midtransClient = require('midtrans-client');
const axios = require('axios')

// === Konfigurasi Cloudinary ===
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

// === Fungsi pembuat token ===
function generateAlphanumericToken(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

/** =======================
 *  REGISTER TO EVENT
 *  ======================= */
exports.registerToEvent = async (eventId, req, user) => {
    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) }
        });
        if (!event) throw new Error("Event tidak ditemukan.");

        const alreadyRegistered = await prisma.registration.findFirst({
            where: { userId: user.id, eventId: event.id }
        });
        if (alreadyRegistered) throw new Error("Anda sudah terdaftar di event ini.");

        // Jika event berbayar
        if (event.price > 0) {
            const orderId = `ORDER-${event.id}-${user.id}-${Date.now()}`;

            const parameter = {
                transaction_details: {
                    order_id: orderId,
                    gross_amount: event.price,
                },
                customer_details: {
                    first_name: user.fullName,
                    email: user.email
                }
            };

            const midtrans = await snap.createTransaction(parameter);

            const registration = await prisma.registration.create({
                data: {
                    userId: user.id,
                    eventId: event.id,
                    status: "PENDING",
                    orderId: orderId,
                    midtransToken: midtrans.token,
                    paymentUrl: midtrans.redirect_url
                },
                include: { event: true, user: true }
            });

            return {
                message: "Silakan lanjutkan pembayaran melalui Midtrans.",
                midtransToken: midtrans.token,
                redirectUrl: midtrans.redirect_url,
                registration
            };
        }

        // === Event GRATISS ===
        const registration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: event.id,
                status: "APPROVED"
            },
            include: { event: true, user: true }
        });

        // Generate token
        const token = generateAlphanumericToken(8);

        await prisma.registration.update({
            where: { id: registration.id },
            data: { token }
        });

        // Kirim email
        try {
            await mailer(
                registration.user.email,
                `Token Pendaftaran Event ${event.title}`,
                `
                <p>Halo ${user.fullName},</p>
                <p>Terima kasih telah mendaftar pada event <strong>${event.title}</strong>.</p>
                <p>Berikut token pendaftaran Anda:</p>
                <h2 style="letter-spacing: 2px; color: #2E86DE;">${token}</h2>
                <p>Gunakan token ini untuk verifikasi kehadiran saat event berlangsung.</p>
                <p>Salam,<br/>Tim SIMKAS</p>
                `
            );
        } catch (err) {
            console.error("Email gagal dikirim:", err.message);
        }

        return {
            message: "Pendaftaran berhasil. Token telah dikirim ke email Anda.",
            registration
        };

    } catch (error) {
        console.error("registerToEvent error:", error.message);
        throw new Error(error.message || "Terjadi kesalahan saat registrasi event.");
    }
};

/** =======================
 *  GET REGISTRATION BY EVENT
 *  ======================= */
exports.getRegistrationsByEvent = async (eventId) => {
    const registrations = await prisma.registration.findMany({
        where: { eventId: parseInt(eventId) },
        include: {
            user: true,
            event: {
                select: {
                    id: true,
                    title: true,
                    qrCode: true,
                    qrExpiresAt: true,  
                },
            },
        },
    });

    return registrations.map((r) => ({
        id: r.id,
        user: {
            fullName: r.user.fullName,
            email: r.user.email,
            phone: r.user.phone,
        },
        status: r.status,
        isAttended: r.isAttended,
        token: r.token,
        paymentProofUrl: r.paymentProofUrl,
        qrCode: r.event.qrCode,
        qrExpiresAt: r.event.qrExpiresAt,
    }));
};
    
/** =======================
 *  EXPORT REGISTRATION CSV
 *  ======================= */
exports.exportRegistrationsCSV = async (eventId) => {
    const registrations = await exports.getRegistrationsByEvent(eventId);
    if (!registrations.length) throw new Error("Tidak ada data registrasi");

    const fields = [
        { label: "Full Name", value: "user.fullName" },
        { label: "Email", value: "user.email" },
        { label: "Phone", value: "user.phone" },
        { label: "Status Pembayaran", value: "status" },
        { label: "Kehadiran", value: (row) => (row.isAttended ? "Hadir" : "Tidak Hadir") },
        { label: "Token", value: "token" },
    ];

    const parser = new Parser({ fields, delimiter: ";" });
    return "\uFEFF" + parser.parse(registrations).replace(/\n/g, "\r\n");
};

/** =======================
 *  DOWNLOAD QR CODE IMAGE
 *  ======================= */
exports.downloadQRCode = async (eventId) => {
    const event = await prisma.event.findUnique({
        where: { id: parseInt(eventId) },
        select: { title: true, qrCodeUrl: true },
    });

    if (!event || !event.qrCodeUrl) {
        throw new Error("QR code tidak ditemukan.");
    }

    const response = await axios.get(event.qrCodeUrl, { responseType: 'arraybuffer' });

    return {
        filename: `${event.title.replace(/\s+/g, "_")}_QRCode.png`,
        data: Buffer.from(response.data),
    };
};

/** =======================
 *  UPDATE PAYMENT STATUS
 *  ======================= */
exports.updatePaymentStatus = async (registrationId, status) => {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        throw new Error("Status tidak valid");
    }

    const registration = await prisma.registration.findUnique({
        where: { id: parseInt(registrationId) },
        include: { event: true, user: true },
    });
    if (!registration) throw new Error("Registrasi tidak ditemukan");

    const updateData = { status };

    if (status === "APPROVED" && registration.event.price > 0 && !registration.token) {
        const token = generateAlphanumericToken(8);
        updateData.token = token;

        try {
            await mailer(
                registration.user.email,
                `Token Pendaftaran Event ${registration.event.title}`,
                `
        <p>Halo ${registration.user.fullName},</p>
        <p>Pembayaran Anda untuk event <strong>${registration.event.title}</strong> telah disetujui.</p>
        <p>Berikut token pendaftaran Anda:</p>
        <h2 style="letter-spacing: 2px; color: #2E86DE;">${token}</h2>
        <p>Gunakan token ini untuk verifikasi kehadiran saat event berlangsung.</p>
        <p>Salam,<br/>Tim SIMKAS</p>
        `
            );
        } catch (err) {
            console.error("Email gagal dikirim:", err.message);
        }
    }

    return prisma.registration.update({
        where: { id: parseInt(registrationId) },
        data: updateData,
    });
};

/** =======================
 *  CHECK USER REGISTRATION
 *  ======================= */
exports.checkUserRegistration = async (eventId, userId) => {
    const registration = await prisma.registration.findFirst({
        where: { eventId: parseInt(eventId), userId },
    });
    return !!registration;
};
