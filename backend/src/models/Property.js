import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
     // Thông tin cơ bản 
     // Tiêu đề bài đăng
    title: {
        type: String,
        required: true
    },
    // Mô tả chi tiết
    description: {
        type: String,
        required: true
    },
    // Giá thuê mỗi tháng
    price: {
        type: Number,
        required: true
    },
    // Phân loại & Trạng thái (Dùng cho các Badge hiển thị)
    property:{
        type: String,
        enum: ["Căn hộ", "Phòng trọ", "Nhà nguyên căn", "Chung cư"],
        default: "Phòng trọ"
    },
    status: {
        type: String,
        enum: ["Còn phòng", "Đã thuê", "Bảo trì"], 
        default: "Còn phòng"
    },
    // Badge "Đã xác thực"
    isVerified: {
        type: Boolean,
        default: false
    },
    // Badge "Phổ biến"
    isPopular: {
        type: Boolean,
        default: false
    },
    // Thông số kỹ thuật (Dùng cho Quick Stats Bar)
    // Diện tích (m2)
    area: {
        type: Number,
        required: true
    },
    // Thời gian thuê tối thiểu
    minLease: {
        type: String,
        default: "6 Tháng"
    },
    // Sức chứa tối đa (người)
    capacity: {
        type: Number,
        default: 1
    },
    // Thông tin an ninh
    security: {
        type: String,
        default: "24/7"
    },
    // Tiện ích [wifi, máy lạnh, thang máy, tủ lạnh...]
    amenities: [{
        type: String
    }],
    // Hình ảnh
    images: [{
        type: String
    }],
    // Vị trí
    location: {
        // Số nhà, tên đường
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
            default: "Vĩnh Long"
        },
        coordinates: {
            // Kinh độ (X phục vụ bản đồ)
            lat: {
                type: Number
            },
            // Vĩ độ (Y)
            lng: {
                type: Number
            }
        },
    },
    // Chủ sở hữu (Liên kết với bảng User để biết ai đăng bài)
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Đánh giá 
    rating: {
        type: Number,
        default: 0 // Điểm TB (4.8)
    },
    reviewCount: {
        type: Number,
        default: 0
    }
    

}, 
{ 
    // Tự động tạo createdAt và updatedAt
    timestamps: true
} 
);

const Property = mongoose.model("Property", propertySchema);
export default Property;