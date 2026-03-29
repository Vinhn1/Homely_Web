import axios from "axios";

// Nơi cấu hình "trụ sở chính" để gọi sang Backend.
const axiosInstance = axios.create({
    // Địa chỉ của Backend
    baseURL: "http://localhost:5000/api",
    // Thời gian chờ tối đa
    timeout: 10000,
    // cho phép gửi kèm các thông tin xác thực tự động trong request
    withCredentials: true,
    // Header mặc định cho mọi request
    headers: {
        "Content-Type": "application/json",
    },

});

export default axiosInstance;