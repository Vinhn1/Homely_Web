import axios from "axios";

// Nơi cấu hình "trụ sở chính" để gọi sang Backend.
const axiosInstance = axios.create({
    // Địa chỉ của Backend
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    // Thời gian chờ tối đa
    timeout: 10000,
    // cho phép gửi kèm các thông tin xác thực tự động trong request
    withCredentials: true,
});

// BỘ ĐÁNH CHẶN (INTERCEPTOR): Chạy trước mỗi khi một yêu cầu được gửi đi
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem("accessToken");
        if (token) {
            // Nếu có token, gắn nó vào Header Authorization theo chuẩn Bearer
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;