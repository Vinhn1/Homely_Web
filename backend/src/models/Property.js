import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    // ===== Thông tin cơ bản =====
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

    // ===== Phân loại & Trạng thái =====
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    // Trạng thái phòng (cho thuê được chưa)
    status: {
        type: String,
        enum: ["Còn phòng", "Đã thuê", "Bảo trì"],
        default: "Còn phòng"
    },
    // Trạng thái bài đăng (owner quản lý)
    listingStatus: {
        type: String,
        enum: ["active", "hidden", "expired"],
        default: "active"
    },
    // Ngày hết hạn tin đăng (30 ngày)
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    // ===== Badges =====
    isVerified: {
        type: Boolean,
        default: false
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    isPromoted: {
        type: Boolean,
        default: false
    },

    // ===== Thông số kỹ thuật =====
    area: {
        type: Number,
        required: true
    },
    bedroom: {
        type: Number,
        default: 1
    },
    bathroom: {
        type: Number,
        default: 1
    },
    floor: {
        type: Number,
        default: 1
    },
    minLease: {
        type: String,
        default: "6 Tháng"
    },
    capacity: {
        type: Number,
        default: 1
    },
    security: {
        type: String,
        default: "24/7"
    },
    legalDocs: {
        type: String,
        default: "Hợp đồng thuê"
    },

    // ===== Tiện ích =====
    amenities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenity"
    }],

    // ===== Hình ảnh =====
    images: [{
        type: String
    }],

    // ===== Vị trí =====
    location: {
        address: {
            type: String,
            required: true
        },
        district: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "District"
        },
        city: {
            type: String,
            required: true,
            default: "Hồ Chí Minh"
        },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        },
    },

    // ===== Chủ sở hữu =====
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // ===== Thống kê =====
    viewCount: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

const Property = mongoose.model("Property", propertySchema);
export default Property;