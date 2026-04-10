import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import propertyRoutes from "./routes/property.route.js";
import bookingRoutes from "./routes/booking.route.js";
import notificationRoutes from "./routes/notification.route.js";
import adminRoutes from "./routes/admin.route.js";
import reportRoutes from "./routes/report.route.js";
import chatRoutes from "./routes/chat.route.js";
import { initSocket } from './utils/socketManager.js';

const app = express();

// ===== RATE LIMITING =====
// Global: giới hạn 100 request/15 phút/IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Quá nhiều request, vui lòng thử lại sau 15 phút.' },
    skip: (req) => req.path.startsWith('/api/properties') && req.method === 'GET', // Bỏ qua public search
});

// Sử dụng Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(globalLimiter);

//======================================================
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chat", chatRoutes);

app.get('/', (req, res) => {
    res.send('Server Homely đang chạy!');
});

// Tạo HTTP server từ Express app để Socket.IO có thể gắn vào
const httpServer = createServer(app);

// Khởi tạo Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Đăng ký socket manager
initSocket(io);

export { httpServer };
export default app;