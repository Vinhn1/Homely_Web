import User from "../models/User.js";

// Hàm xử lý đăng ký 
export const register = async (req, res) => {
    try{
        const {username, password, email, firstName, lastName} = req.body;
        
        // Kiểm tra validate 
        if(!username || !password || !email || !firstName || !lastName){
            return res.status(400).json({
                message: "Vui lòng nhập đầy đủ các thông tin!"
            });
        }

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