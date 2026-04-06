import axiosInstance from "@/api/axios";
// "Đầu não" điều phối toàn bộ các yêu cầu liên quan đến xác thực.

// ========================================================================
// Nhận dữ liệu từ Form đăng ký và gửi lên Server
export const signUp = async (userData) => {
    // Gửi một yêu cầu POST mang theo dữ liệu người dùng (userData - bao gồm email, password, name...) lên ngõ /auth/signUp.
    const response = await axiosInstance.post('/auth/signUp', userData);
    // Thông báo "Đăng ký thành công" hoặc thông tin User mới từ Server gửi về.
    return response.data;
}

// ========================================================================
// Gửi yêu cầu POST chứa username và password lên ngõ /auth/signIn.
export const signIn = async (credentials) => {
    const response = await axiosInstance.post('/auth/signIn', credentials);
    return response.data;
}

// ========================================================================
// Hàm lấy thông tin cá nhân 
export const getMe = async () => {
    // Gửi một yêu cầu lên ngõ /auth/me.
    const response = await axiosInstance.get('/auth/me');
    return response.data;
}


// Hàm cập nhật thông tin cá nhân
export const updateProfile = async (formData) => {
    // Gửi yêu cầu PUT tới /user/profile kèm theo dữ liệu formData 
    // Backend sẽ dùng multer để bóc tách file và data từ đây 
    const response = await axiosInstance.put('/user/profile', formData);
    return response.data;
}