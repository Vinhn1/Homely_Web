import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Tạo mới đặt phòng (Yêu cầu đăng nhập)
router.post("/", protect, createBooking);

// Lấy danh sách phòng đã đặt của tôi
router.get("/me", protect, getMyBookings);

// Hủy đặt phòng
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
