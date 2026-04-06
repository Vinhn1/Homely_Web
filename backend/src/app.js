import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import propertyRoutes from "./routes/property.route.js";

const app = express();

// Sử dụng Middleware (để đọc dữ liệu từ form)
app.use(express.json());
// Đảm bảo server có thể đọc được dữ liệu từ các loại form HTML truyền thống 
app.use(express.urlencoded({extended: true}));
app.use(cors({
    origin: "http://localhost:5173", // Địa chỉ chính xác frontend 
    credentials: true // Cho phép gửi kèm thông tin xác thực (Cookie/Headers)
}));



//======================================================
// Mọi Đ/C bắt đầu bằng /api/auth sẽ được chuyển hướng sang authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/properties", propertyRoutes);



app.get('/', (req, res) => {
    res.send('Server Homely đang chạy!');
});

export default app;