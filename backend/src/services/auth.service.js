const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const { generateOtp } = require('../utils/otp')
const { generateToken } = require('../utils/token')
const crypto = require('crypto');
const mailer = require('../utils/mailer')

exports.register = async (data) => {
    const {
        fullName,
        email,
        phone,
        address,
        education,
        password
    } = data;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new Error('Email sudah digunakan.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            address,
            education,
            passwordHash: hashedPassword
        }
    });

    // Generate OTP (6 digit acak)
    const otp = generateOtp();

    await prisma.emailToken.create({
        data: {
            userId: user.id,
            otp,
            type: 'VERIFICATION',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 menit
        }
    });

    // Kirim OTP lewat email
    const emailHtml = `
        <h3>Verifikasi Email</h3>
        <p>Halo ${fullName},</p>
        <p>Kode OTP untuk verifikasi akun Anda adalah:</p>
        <h2>${otp}</h2>
        <p>Kode ini berlaku selama 5 menit. Jangan berikan kode ini ke siapapun.</p>
    `;
    await mailer(email, 'Verifikasi Email Akun Event App', emailHtml);

    return { message: 'Akun berhasil dibuat. Silakan cek email untuk verifikasi dalam 5 menit.' };
};

exports.verifyEmail = async ({ email, otp }) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Email tidak ditemukan.')

    const tokenRecord = await prisma.emailToken.findFirst({
        where: {
        userId: user.id,
        otp,
        type: 'VERIFICATION'
        },
        orderBy: { createdAt: 'desc' }
    })

    if (!tokenRecord) throw new Error('OTP tidak valid.')
    if (new Date() > tokenRecord.expiresAt) throw new Error('OTP sudah kedaluwarsa.')

    if (user.isVerified) {
        return { message: 'Akun sudah terverifikasi sebelumnya.' }
    }

    await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true }
    })

    // Hapus token setelah digunakan (opsional tapi disarankan)
    await prisma.emailToken.delete({ where: { id: tokenRecord.id } })

    return { message: 'Email berhasil diverifikasi. Silakan login.' }
}

exports.login = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error('Akun tidak ditemukan.')

    if (!user.isVerified) throw new Error('Email belum diverifikasi.')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new Error('Password salah.')

    const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role
    })

    return {
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '5m',
        user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
        }
    }
}

exports.requestPasswordReset = async ({ email }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Email tidak ditemukan.');

    // Generate token unik
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // berlaku 1 jam

    // Simpan token di EmailToken
    await prisma.emailToken.create({
        data: {
            userId: user.id,
            otp: token,
            type: 'RESET',
            expiresAt: expiry
        }
    });

    // Buat URL reset password (sesuaikan domain frontend Anda)
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

    // Kirim email
    const emailHtml = `
        <h3>Reset Password</h3>
        <p>Anda menerima email ini karena ada permintaan reset password untuk akun Anda.</p>
        <p>Klik link berikut untuk reset password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
    `;
    await mailer(email, 'Reset Password Akun Anda', emailHtml);

    return { message: 'Link reset password telah dikirim ke email.' };
};

exports.resetPassword = async ({ token, newPassword }) => {
    const tokenRecord = await prisma.emailToken.findFirst({
        where: { otp: token, type: 'RESET' },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    if (!tokenRecord) throw new Error('Token tidak valid.');
    if (new Date() > tokenRecord.expiresAt) throw new Error('Token sudah kedaluwarsa.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    await prisma.user.update({
        where: { id: tokenRecord.user.id },
        data: { passwordHash: hashedPassword }
    });

    // Hapus token setelah digunakan
    await prisma.emailToken.delete({ where: { id: tokenRecord.id } });

    return { message: 'Password berhasil direset. Silakan login.' };
};
