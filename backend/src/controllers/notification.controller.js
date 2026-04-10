import Notification from '../models/Notification.js';
import { emitNotification } from '../utils/socketManager.js';

// Helper: Tạo notification và gửi real-time
export const createNotification = async (recipientId, type, data) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            type,
            title: data.title,
            message: data.message,
            relatedProperty: data.relatedProperty || null,
            relatedBooking: data.relatedBooking || null,
        });
        // Gửi real-time qua Socket.IO
        emitNotification(recipientId.toString(), notification);
        return notification;
    } catch (error) {
        console.error('Lỗi tạo notification:', error);
    }
};

// GET /api/notifications — Lấy danh sách thông báo của tôi
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find({ recipient: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments({ recipient: userId }),
            Notification.countDocuments({ recipient: userId, isRead: false })
        ]);

        res.status(200).json({
            success: true,
            data: notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/notifications/:id/read — Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { isRead: true },
            { returnDocument: 'after' }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo.' });
        }

        res.status(200).json({ success: true, data: notification });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/notifications/read-all — Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: 'Đã đánh dấu tất cả thông báo là đã đọc.' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
        res.status(200).json({ success: true, message: 'Đã xóa thông báo.' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
