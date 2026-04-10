import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { createNotification } from './notification.controller.js';

// POST /api/bookings — Tenant tạo yêu cầu đặt phòng
export const createBooking = async (req, res) => {
    try {
        const { propertyId, moveInDate, leaseTerm, note, contactPhone } = req.body;
        const tenantId = req.user._id;

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Không tìm thấy căn hộ." });
        }

        if (property.status !== 'Còn phòng') {
            return res.status(400).json({ success: false, message: "Phòng này hiện đã được thuê." });
        }

        const booking = await Booking.create({
            property: propertyId,
            tenant: tenantId,
            owner: property.owner,
            moveInDate,
            leaseTerm,
            totalPrice: property.price,
            note,
            contactPhone: contactPhone || req.user.phone
        });

        // 🔔 Gửi thông báo cho owner
        await createNotification(property.owner, 'new_booking', {
            title: '🏠 Có người muốn thuê phòng!',
            message: `${req.user.displayName} vừa gửi yêu cầu thuê "${property.title}". Vui lòng xem xét và phản hồi.`,
            relatedProperty: propertyId,
            relatedBooking: booking._id
        });

        res.status(201).json({
            success: true,
            message: "Yêu cầu đặt phòng đã được gửi đi thành công!",
            data: booking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/bookings/me — Tenant lấy danh sách booking của mình
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ tenant: userId })
            .populate({
                path: 'property',
                select: 'title images price location category area',
                populate: [
                    { path: 'owner', select: 'displayName avatarUrl phone' },
                    { path: 'category', select: 'name icon' }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/bookings/owner-requests — Owner xem yêu cầu thuê phòng của mình
export const getOwnerBookingRequests = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { status } = req.query;

        let query = { owner: ownerId };
        if (status && status !== 'all') {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('tenant', 'displayName avatarUrl phone email')
            .populate({
                path: 'property',
                select: 'title images price location category',
                populate: { path: 'category', select: 'name icon' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/bookings/:id/confirm — Owner xác nhận booking
export const confirmBooking = async (req, res) => {
    try {
        const ownerId = req.user._id;

        const booking = await Booking.findOne({ _id: req.params.id, owner: ownerId })
            .populate('property', 'title')
            .populate('tenant', 'displayName');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy yêu cầu đặt phòng." });
        }
        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Yêu cầu này đã được xử lý rồi." });
        }

        booking.status = 'confirmed';
        await booking.save();

        // Cập nhật trạng thái phòng
        await Property.findByIdAndUpdate(booking.property._id, { status: 'Đã thuê' });

        // 🔔 Gửi thông báo cho tenant
        await createNotification(booking.tenant._id, 'booking_confirmed', {
            title: '✅ Yêu cầu thuê phòng được chấp nhận!',
            message: `Chủ nhà đã xác nhận yêu cầu thuê "${booking.property.title}" của bạn. Hãy liên hệ để sắp xếp dọn vào.`,
            relatedProperty: booking.property._id,
            relatedBooking: booking._id
        });

        res.status(200).json({
            success: true,
            message: 'Đã xác nhận yêu cầu thuê phòng.',
            data: booking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/bookings/:id/cancel — Hủy booking (owner hoặc tenant)
export const cancelBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        const { cancelReason } = req.body;

        // Cho phép cả owner và tenant hủy
        const booking = await Booking.findOne({
            _id: req.params.id,
            $or: [{ tenant: userId }, { owner: userId }]
        }).populate('property', 'title').populate('tenant', 'displayName').populate('owner', 'displayName');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt phòng hoặc bạn không có quyền." });
        }

        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ success: false, message: "Không thể hủy đơn đã hoàn thành hoặc đã hủy." });
        }

        const isOwner = booking.owner._id.toString() === userId.toString();
        booking.status = 'cancelled';
        booking.cancelReason = cancelReason || '';
        await booking.save();

        // Khôi phục trạng thái phòng nếu đã confirmed
        if (booking.status === 'confirmed') {
            await Property.findByIdAndUpdate(booking.property._id, { status: 'Còn phòng' });
        }

        // 🔔 Thông báo cho bên còn lại
        const notifyRecipient = isOwner ? booking.tenant._id : booking.owner._id;
        const notifyTitle = isOwner
            ? '❌ Yêu cầu thuê phòng bị từ chối'
            : '❌ Đơn đặt phòng đã bị hủy';
        const notifyMessage = isOwner
            ? `Chủ nhà đã từ chối yêu cầu thuê "${booking.property.title}". ${cancelReason ? `Lý do: ${cancelReason}` : ''}`
            : `Bạn đã hủy yêu cầu thuê "${booking.property.title}".`;

        await createNotification(notifyRecipient, 'booking_cancelled', {
            title: notifyTitle,
            message: notifyMessage,
            relatedProperty: booking.property._id,
            relatedBooking: booking._id
        });

        res.status(200).json({ success: true, message: "Đơn đặt phòng đã được hủy." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
