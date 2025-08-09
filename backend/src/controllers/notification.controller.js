const notificationService = require('../services/notification.service');

exports.list = async (req, res, next) => {
    try {
        const notifications = await notificationService.getUserNotifications(req.user.id);
        const unreadCount = await notificationService.countUnreadNotifications(req.user.id);
        res.json({ unreadCount, notifications });
    } catch (error) {
        next(error);
    }
};

exports.read = async (req, res, next) => {
    try {
        await notificationService.markAsRead(parseInt(req.params.id), req.user.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

exports.readAll = async (req, res, next) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await notificationService.deleteNotification(parseInt(req.params.id), req.user.id);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
};
