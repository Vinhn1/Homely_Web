import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Cổng bảo vệ xác thực đúng mới cho vào routes 
export const protect = async (req, res, next) => {
 try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if(!token){
        return res.status(401).json({message: "Không tìm thấy access token"});
    }


    // Xác nhận token hợp lệ
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // tìm user
    const user = await User.findById(decoded.userId);
    if(!user){
        return res.status(404).json({message: "Người dùng không tồn tại."}); 
    }

    // Gắn user vào req 
    req.user = user;
    next();


 }catch(error){
    console.error("Lỗi xác minh jwt trong authMiddleware.");
    return res.status(403).json({message: "Token không hợp lệ hoặc đã hết hạn"});
 }
}