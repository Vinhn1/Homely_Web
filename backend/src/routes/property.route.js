import express from 'express';
import { getProperties, getPropertyById, addReview } from '../controllers/property.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Router lấy danh sách (kết nối với hàm tìm kiếm/lọc)
router.get("/", getProperties);

// Router lấy chi tiết (Dùng ID để xác định căn hộ)
router.get("/:id", getPropertyById);

// Thêm đánh giá (Yêu cầu đăng nhập)
router.post("/:id/reviews", protect, addReview);

export default router;