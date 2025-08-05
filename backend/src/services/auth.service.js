const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateOtp } = require('../utils/otp')
const { generateToken } = require('../utils/token')

const prisma = new PrismaClient()

exports.register = async (data) => {
    const {
        fullName,
        email,
        phone,
        address,
        education,
        password
    } = data

    const userExists = await prisma.user.findUnique({ where: { email } })
    if (userExists) throw new Error('Email sudah digunakan.')

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            fullName,
            email,
            phone,
            address,
            education,
            passwordHash: hashedPassword
        }
    })

    // Generate OTP (6 digit acak)
    const otp = generateOtp()

    await prisma.emailToken.create({
        data: {
            userId: user.id,
            otp,
            type: 'VERIFICATION',
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 menit
        }
    })

    console.log(`[OTP] ${email} → ${otp}`) // Sementara log ke konsol

    return { message: 'Akun berhasil dibuat. Silakan verifikasi email dalam 5 menit.' }
}

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

