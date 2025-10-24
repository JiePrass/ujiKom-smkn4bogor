const { PrismaClient } = require('@prisma/client');
const { Parser } = require("json2csv");
const cloudinary = require('cloudinary').v2;
const mailer = require('../utils/mailer')
const prisma = new PrismaClient();
const fs = require('fs');

// === Konfigurasi Cloudinary ===
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

// === Registrasi ke event ===
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

        let paymentProofUrl = null;
        let status = "APPROVED";
        let token = null;

        // === Jika event berbayar ===
        if (event.price > 0) {
            const paymentProofFile = req.files?.paymentProof?.[0];
            if (!paymentProofFile) throw new Error("Bukti pembayaran wajib diunggah.");

            try {
                const uploadResult = await cloudinary.uploader.upload(paymentProofFile.path, {
                    folder: `simkas/payments/${event.id}`,
                    use_filename: true,
                    unique_filename: true,
                    resource_type: "image"
                });
                paymentProofUrl = uploadResult.secure_url;
                status = "PENDING";
            } catch (err) {
                console.error("Cloudinary upload failed:", err.message);
                throw new Error("Gagal mengunggah bukti pembayaran.");
            } finally {
                // Hapus file lokal sementara
                if (paymentProofFile?.path && fs.existsSync(paymentProofFile.path)) {
                    fs.unlinkSync(paymentProofFile.path);
                }
            }
        } else {
            token = generateAlphanumericToken(8);
        }

        // === Simpan ke database ===
        const registration = await prisma.registration.create({
            data: {
                userId: user.id,
                eventId: event.id,
                paymentProofUrl,
                status,
                ...(token && { token })
            },
            include: { event: true, user: true }
        });

        // === Kirim email token kalau sudah punya token ===
        if (status === "APPROVED") {
            // Pastikan token ada (karena event gratis otomatis punya token)
            if (!token) {
                token = generateAlphanumericToken(8);
                await prisma.registration.update({
                    where: { id: registration.id },
                    data: { token }
                });
            }

            try {
                console.log("📧 Mengirim email ke:", registration.user.email);
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
                console.log("✅ Email berhasil dikirim ke:", user.email);
            } catch (err) {
                console.error("❌ Email gagal dikirim:", err);
            }
        }

        return {
            message:
                status === "PENDING"
                    ? "Pendaftaran berhasil, menunggu verifikasi pembayaran."
                    : "Pendaftaran berhasil. Token telah dikirim ke email Anda.",
            registration
        };
    } catch (error) {
        console.error("registerToEvent error:", error.message);
        throw new Error(error.message || "Terjadi kesalahan saat registrasi event.");
    }
};

// === Fungsi lainnya (tetap sama) ===
exports.getRegistrationsByEvent = async (eventId) => {
    return prisma.registration.findMany({
        where: { eventId: parseInt(eventId) },
        include: { user: true }
    });
};

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

exports.updatePaymentStatus = async (registrationId, status) => {
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        throw new Error("Status tidak valid");
    }

    const registration = await prisma.registration.findUnique({
        where: { id: parseInt(registrationId) },
        include: { event: true, user: true }
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
        data: updateData
    });
};

exports.checkUserRegistration = async (eventId, userId) => {
    const registration = await prisma.registration.findFirst({
        where: { eventId: parseInt(eventId), userId }
    });
    return !!registration;
};
