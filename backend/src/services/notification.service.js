const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createNotification = async (userId, title, message, type) => {
    return prisma.notification.create({
        data: {
        userId,
        title,
        message,
        type
        }
    });
};

exports.getUserNotifications = async (userId) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
};

exports.countUnreadNotifications = async (userId) => {
    return prisma.notification.count({
        where: { userId, isRead: false }
    });
};

exports.markAsRead = async (id, userId) => {
    return prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true }
    });
};

exports.markAllAsRead = async (userId) => {
    return prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
    });
};

exports.deleteNotification = async (id, userId) => {
    return prisma.notification.deleteMany({
        where: { id, userId }
    });
};

exports.deleteOldReadNotifications = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.notification.deleteMany({
        where: {
        isRead: true,
        createdAt: { lt: sevenDaysAgo }
        }
    });
};