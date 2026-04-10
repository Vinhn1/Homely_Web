import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    // Người nhận thông báo (Owner hoặc Tenant)
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Loại thông báo
    type: {
        type: String,
        enum: ['new_booking', 'booking_confirmed', 'booking_cancelled', 'new_review', 'owner_approved', 'owner_rejected', 'listing_verified', 'listing_hidden', 'account_banned'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    // Liên kết tới Property / Booking để điều hướng khi click
    relatedProperty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
    },
    relatedBooking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
