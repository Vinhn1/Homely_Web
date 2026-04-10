import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { signInSchema, signUpSchema } from "../validations/auth.validation.js";

// Hàm xử lý đăng ký 
export const signUp = async (req, res) => {
    try{
        // Kiểm tra validate từ zode
        const result = signUpSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({message: "Dữ liệu không hợp lệ", errors: result.error.flatten().fieldErrors});
        }

        // Lấy dữ liệu sạch 
        const {username, password, email, displayName, role} = result.data;
        


        // Kiểm tra username tồn tại chưa 
       const duplicate = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (duplicate) {
    // Nếu trùng email
         if (duplicate.email === email) {
                return res.status(409).json({ message: "Email này đã được sử dụng!" });
            }
            // Nếu trùng username
            return res.status(409).json({ message: "Username này đã tồn tại!" });
        }

        // Tạo user mới
        const newUser = await User.create({
            username,
            email,
            hashedPassword: password,
            displayName,
            role
        })
        // return 
        return res.status(201).json({message: "Đăng ký thành công!", user: {
            username: newUser.username,
            email: newUser.email
        }});

    }catch(error){
        console.error(">>> Lỗi chi tiết: ", error);
        // Kiểm tra nếu là lỗi trùng lặp dữ liệu (Mã 11000)
        if(error.code === 11000){
            // Kiểm tra có phải trùng email hay không 
            if(error.keyValue && error.keyValue.email){
                return res.status(400).json({message: "Email này đã tồn tại, vui lòng nhập email khác!"});
            }

            // Trùng Username 
            if(error.keyValue && error.keyValue.username){
                return res.status(400).json({message: "Username đã tồn tại!"});
            }
        }
        return res.status(500).json({message: "Lỗi hệ thống!"})
    }
    
}

// Hàm xử lý đăng nhập
export const signIn = async(req, res) => {
    try{

        const result = signInSchema.safeParse(req.body);
        
        if(!result.success){
            return res.status(400).json({message: "Dữ liệu không hợp lệ", errors: result.error.flatten().fieldErrors});
        }

        const {username, password} = result.data;
        
        // Kiểm tra sự tồn tại của người dùng
        const user = await User.findOne({
            $or: [
                {username: username},
                {email: username}
            ]
        });
        if(!user){
            return res.status(404).json({message: "Tài khoản hoặc mật khẩu không chính xác."})
        }

        // Dùng comparePassword để so khớp mật khẩu 
        const passwordCorrect = await user.comparePassword(password);

        if(!passwordCorrect){
            return res.status(401).json({message: "Tài khoản hoặc mật khẩu không chính xác."})
        }

        // Tạo token nếu mật khẩu đúng 
        // JWT(payload, secret, options)
        // payload: Là một object chứa thông tin nhận diện (thường là id của user).
        // secret: Lấy từ process.env.JWT_SECRET
        // options: Một object chứa thời gian hết hạn (expiresIn) lấy từ .env.
        const accessToken = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Trả access token về trong res 
        return res.status(200).json({message: `Chào mừng ${user.displayName} đã quay trở lại`, 
        accessToken, 
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            bio: user.bio,
            ownerRequestStatus: user.ownerRequestStatus,
            isBanned: user.isBanned,
            banReason: user.banReason,
            createdAt: user.createdAt
        }});

    }catch(error){
        console.error("Có lỗi xảy ra khi gọi signIn: ", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

// GET /api/auth/me — Luôn lấy data MỚI NHẤT từ DB
export const getMe = async (req, res) => {
    try {
        // Query lại từ DB để luôn có role/ban status mới nhất
        const freshUser = await User.findById(req.user._id).select('-hashedPassword');
        if (!freshUser) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        return res.status(200).json({ user: freshUser });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi hệ thống' });
    }
}

// POST /api/auth/request-owner — User xin trở thành chủ nhà (chờ admin duyệt)
export const requestOwnerRole = async (req, res) => {
    try {
        const user = req.user;
        if (user.role === 'owner') {
            return res.status(400).json({ message: 'Bạn đã là chủ nhà rồi.' });
        }
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Admin không cần đăng ký vai trò này.' });
        }
        if (user.ownerRequestStatus === 'pending') {
            return res.status(400).json({ message: 'Yêu cầu của bạn đang chờ admin phê duyệt.' });
        }

        user.ownerRequestStatus = 'pending';
        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Yêu cầu trở thành chủ nhà đã được gửi! Admin sẽ phê duyệt trong vòng 24 giờ.' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};