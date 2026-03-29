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
        const {username, password, email, firstName, lastName} = result.data;
        


        // Kiểm tra username tồn tại chưa 
        const duplicate = await User.findOne({username});
        if(duplicate){
            // 409: báo hiệu rằng yêu cầu của người dùng đang bị xung đột với dữ liệu hiện có trên Server
            return res.status(409).json({message: "Username đã tồn tại!"})
        }

        // Tạo user mới
        const newUser = await User.create({
            username,
            email,
            hashedPassword: password,
            displayName: firstName + " " + lastName
        })
        // return 
        return res.status(201).json({message: "Đăng ký thành công!", user: {
            username: newUser.username,
            email: newUser.email
        }});

    }catch(error){
        console.error(">>> Lỗi chi tiết: ", error);
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
        const user = await User.findOne({username});
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
        return res.status(200).json({message: `User ${user.displayName} đã logged in!`, accessToken});

    }catch(error){
        console.error("Có lỗi xảy ra khi gọi signIn: ", error);
        return res.status(500).json({message: "Lỗi hệ thống"});
    }
}

export const getMe = (req, res) => {
    return res.status(200).json({user: req.user});
}