import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import Report from '../models/Report.js';
import { createNotification } from './notification.controller.js';

// ====================================================
// STATS
// ====================================================

// GET /api/admin/stats
export const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            totalOwners,
            totalProperties,
            totalBookings,
            pendingOwnerRequests,
            pendingReports,
            activeListings,
            bannedUsers
        ] = await Promise.all([
            User.countDocuments({ role: { $ne: 'admin' } }),
            User.countDocuments({ role: 'owner' }),
            Property.countDocuments(),
            Booking.countDocuments(),
            User.countDocuments({ ownerRequestStatus: 'pending' }),
            Report.countDocuments({ status: 'pending' }),
            Property.countDocuments({ listingStatus: 'active' }),
            User.countDocuments({ isBanned: true })
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalOwners,
                totalProperties,
                totalBookings,
                pendingOwnerRequests,
                pendingReports,
                activeListings,
                bannedUsers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ====================================================
// USER MANAGEMENT
// ====================================================

// GET /api/admin/users?role=&status=&page=&search=
export const getUsers = async (req, res) => {
    try {
        const { role, status, search, page = 1, limit = 15 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let filter = { role: { $ne: 'admin' } };

        if (role && role !== 'all') filter.role = role;
        if (status === 'pending') filter.ownerRequestStatus = 'pending';
        if (status === 'banned') filter.isBanned = true;
        if (search) {
            filter.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ];
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-hashedPassword')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            User.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: users,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/users/:id/approve-owner
export const approveOwnerRequest = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });

        user.role = 'owner';
        user.ownerRequestStatus = 'approved';
        await user.save();

        // Gửi notification real-time
        await createNotification(user._id, 'owner_approved', {
            title: '🎉 Yêu cầu được chấp thuận!',
            message: 'Chúc mừng! Tài khoản của bạn đã được nâng cấp lên Chủ nhà. Bạn có thể đăng tin cho thuê ngay bây giờ.'
        });

        res.json({ success: true, message: 'Đã duyệt yêu cầu trở thành Chủ nhà.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/users/:id/reject-owner
export const rejectOwnerRequest = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });

        user.ownerRequestStatus = 'rejected';
        await user.save();

        await createNotification(user._id, 'owner_rejected', {
            title: '❌ Yêu cầu bị từ chối',
            message: reason || 'Yêu cầu trở thành Chủ nhà của bạn chưa được phê duyệt. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.'
        });

        res.json({ success: true, message: 'Đã từ chối yêu cầu.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/users/:id/ban
export const banUser = async (req, res) => {
    try {
        const { reason, unban } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });

        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Không thể khóa tài khoản Admin.' });
        }

        user.isBanned = !unban; // unban=true thì mở khóa
        user.banReason = unban ? null : (reason || 'Vi phạm điều khoản sử dụng');
        await user.save();

        if (!unban) {
            await createNotification(user._id, 'account_banned', {
                title: '🔒 Tài khoản bị khóa',
                message: `Tài khoản của bạn đã bị tạm khóa. Lý do: ${reason || 'Vi phạm điều khoản sử dụng'}.`
            });
        }

        res.json({ success: true, message: unban ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ====================================================
// LISTING MANAGEMENT
// ====================================================

// GET /api/admin/listings?listingStatus=&isVerified=&page=&search=
export const getListings = async (req, res) => {
    try {
        const { listingStatus, isVerified, search, page = 1, limit = 15 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let filter = {};
        if (listingStatus && listingStatus !== 'all') filter.listingStatus = listingStatus;
        if (isVerified === 'true') filter.isVerified = true;
        if (isVerified === 'false') filter.isVerified = false;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        const [listings, total] = await Promise.all([
            Property.find(filter)
                .populate('owner', 'displayName email avatarUrl')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Property.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: listings,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/listings/:id/verify
export const verifyListing = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { returnDocument: 'after' }
        ).populate('owner', '_id');

        if (!property) return res.status(404).json({ success: false, message: 'Tin đăng không tồn tại.' });

        // Notify owner
        await createNotification(property.owner._id, 'listing_verified', {
            title: '✅ Tin đăng được xác thực',
            message: `Tin đăng "${property.title}" đã được Admin xác thực. Badge "Đã xác thực" sẽ hiển thị trên tin của bạn.`,
            relatedProperty: property._id
        });

        res.json({ success: true, message: 'Đã xác thực tin đăng.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/listings/:id/unverify
export const unverifyListing = async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { isVerified: false },
            { returnDocument: 'after' }
        );
        if (!property) return res.status(404).json({ success: false, message: 'Tin đăng không tồn tại.' });
        res.json({ success: true, message: 'Đã bỏ xác thực tin đăng.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/listings/:id/toggle-hide
export const toggleHideListing = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', '_id');
        if (!property) return res.status(404).json({ success: false, message: 'Tin đăng không tồn tại.' });

        const newStatus = property.listingStatus === 'hidden' ? 'active' : 'hidden';
        property.listingStatus = newStatus;
        await property.save();

        if (newStatus === 'hidden') {
            await createNotification(property.owner._id, 'listing_hidden', {
                title: '⚠️ Tin đăng bị ẩn',
                message: `Tin đăng "${property.title}" đã bị Admin ẩn do vi phạm quy định. Vui lòng liên hệ hỗ trợ.`,
                relatedProperty: property._id
            });
        }

        res.json({ success: true, message: newStatus === 'hidden' ? 'Đã ẩn tin đăng.' : 'Đã khôi phục tin đăng.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/admin/listings/:id
export const deleteListing = async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: 'Tin đăng không tồn tại.' });
        res.json({ success: true, message: 'Đã xóa tin đăng.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ====================================================
// REPORTS
// ====================================================

// POST /api/reports (public, cần đăng nhập)
export const submitReport = async (req, res) => {
    try {
        const { targetType, targetId, reason, description } = req.body;
        if (!targetType || !targetId || !reason) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin báo cáo.' });
        }

        // Kiểm tra đã báo cáo trước đó chưa
        const existing = await Report.findOne({
            reporter: req.user._id,
            targetType,
            targetId,
            status: 'pending'
        });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Bạn đã gửi báo cáo này rồi, đang chờ xử lý.' });
        }

        const report = await Report.create({
            reporter: req.user._id,
            targetType,
            targetId,
            reason,
            description
        });

        res.status(201).json({ success: true, message: 'Báo cáo đã được gửi. Cảm ơn bạn!', data: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/admin/reports?status=&targetType=&page=
export const getReports = async (req, res) => {
    try {
        const { status, targetType, page = 1, limit = 15 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let filter = {};
        if (status && status !== 'all') filter.status = status;
        if (targetType && targetType !== 'all') filter.targetType = targetType;

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .populate('reporter', 'displayName email avatarUrl')
                .populate({ path: 'targetId', select: 'title displayName email images location' })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Report.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: reports,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/reports/:id/resolve
export const resolveReport = async (req, res) => {
    try {
        const { adminNote } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            {
                status: 'resolved',
                adminNote,
                resolvedBy: req.user._id,
                resolvedAt: new Date()
            },
            { returnDocument: 'after' }
        );
        if (!report) return res.status(404).json({ success: false, message: 'Báo cáo không tồn tại.' });
        res.json({ success: true, message: 'Đã đánh dấu báo cáo là đã giải quyết.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/admin/reports/:id/dismiss
export const dismissReport = async (req, res) => {
    try {
        const { adminNote } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            {
                status: 'dismissed',
                adminNote,
                resolvedBy: req.user._id,
                resolvedAt: new Date()
            },
            { returnDocument: 'after' }
        );
        if (!report) return res.status(404).json({ success: false, message: 'Báo cáo không tồn tại.' });
        res.json({ success: true, message: 'Đã bỏ qua báo cáo.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
