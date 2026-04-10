import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'], 
        default: 'user'
    },
    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Vui lòng nhập đúng định dạng email']
    },
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    avatarUrl: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 500
    },
    phone: {
        type: String,
        sparse: true,
    },
    // Trạng thái yêu cầu trở thành chủ nhà (null = chưa yêu cầu)
    ownerRequestStatus: {
        type: String,
        enum: [null, 'pending', 'approved', 'rejected'],
        default: null
    },
    // Admin có thể khóa tài khoản
    isBanned: {
        type: Boolean,
        default: false
    },
    // Lý do bị khóa
    banReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
});

// Là một hàm async. Dùng từ khóa this
// để truy cập vào dữ liệu của người dùng ngay trước khi nó "bay" vào Database.
userSchema.pre('save', async function() {
    // Kiểm tra nếu không đổi mật khẩu thì thoát ra luôn
    if(!this.isModified('hashedPassword')) return;
    // Băm mk
    // B1: Tạo Salt 
    const salt = await bcryptjs.genSalt(10); // Số 10 chính là Cost Factor (Số vòng lặp thuật toán).
    // B2: Tạo Hash
    this.hashedPassword = await bcryptjs.hash(this.hashedPassword, salt);
});


// Hàm so sánh mk thực hiện 4 chức năng 
// 1. Lấy mật khẩu người dùng mới nhập
// 2. Lấy chuỗi Salt (muối) được lưu ẩn bên trong mật khẩu đã băm ở database
// 3. Thực hiện băm mật khẩu mới nhập với cái Salt đó
// 4. Nếu kết quả băm mới giống hệt kết quả băm cũ -> Trả về true. Nếu khác -> Trả về false.
userSchema.methods.comparePassword = async function(candidatePassword) {
    // andidatePassword là mật khẩu người dùng vừa gõ ở form đăng nhập
    return await bcryptjs.compare(candidatePassword, this.hashedPassword);
}


const User = mongoose.model("User", userSchema);
export default User;