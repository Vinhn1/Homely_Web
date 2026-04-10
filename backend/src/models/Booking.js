import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Ref nhanh đến chủ nhà (tránh lookup ông trên property)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moveInDate: {
        type: Date,
        required: true
    },
    leaseTerm: {
        type: String,
        required: true,
        default: '6 Tháng'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    // Số điện thoại liên hệ của tenant
    contactPhone: {
        type: String,
        trim: true
    },
    note: {
        type: String,
        trim: true
    },
    // Lý do hủy (nếu có)
    cancelReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
