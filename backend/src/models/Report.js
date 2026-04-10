import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    // Người gửi báo cáo
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Loại đối tượng bị báo cáo
    targetType: {
        type: String,
        enum: ['property', 'user'],
        required: true
    },
    // ID đối tượng bị báo cáo
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    // Lý do báo cáo
    reason: {
        type: String,
        enum: [
            'Thông tin sai lệch',
            'Ảnh giả mạo / không đúng thực tế',
            'Giá cả gian lận',
            'Nội dung không phù hợp',
            'Lừa đảo / scam',
            'Vi phạm quy định cộng đồng',
            'Khác'
        ],
        required: true
    },
    // Mô tả chi tiết
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    // Trạng thái xử lý
    status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
    },
    // Ghi chú của admin khi xử lý
    adminNote: {
        type: String,
        trim: true
    },
    // Admin xử lý
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index để tìm kiếm nhanh
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ targetType: 1, targetId: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
