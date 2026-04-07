import Booking from '../models/Booking.js';
import Property from '../models/Property.js';

// Tạo mới đơn đặt phòng
export const createBooking = async (req, res) => {
    try {
        const { propertyId, moveInDate, leaseTerm, note } = req.body;
        const userId = req.user._id;

        // 1. Kiểm tra căn hộ tồn tại
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Không tìm thấy căn hộ." });
        }

        // 2. Tạo bản ghi đặt phòng
        const booking = await Booking.create({
            property: propertyId,
            tenant: userId,
            moveInDate,
            leaseTerm,
            totalPrice: property.price, // Lưu lại giá tại thời điểm đặt 
            note
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

// Lấy danh sách phòng đã đặt của tôi
export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user._id;

        // Tìm tất cả booking của user hiện tại
        // Populate thông tin căn hộ (ảnh, tiêu đề, giá, địa chỉ)
        const bookings = await Booking.find({ tenant: userId })
            .populate({
                path: 'property',
                select: 'title images price location property area', // Chỉ lấy các trường cần thiết
                populate: {
                    path: 'owner',
                    select: 'displayName avatarUrl'
                }
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

// Hủy đơn đặt phòng
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const booking = await Booking.findOne({ _id: id, tenant: userId });
        
        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn đặt phòng hoặc bạn không có quyền." });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ success: false, message: "Không thể hủy đơn đã được xử lý." });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ success: true, message: "Đơn đặt phòng đã được hủy." });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
