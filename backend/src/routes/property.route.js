import express from 'express';
import { getProperties, getPropertyById } from '../controllers/property.controller.js';

const router = express.Router();

// Router lấy danh sách (kết nối với hàm tìm kiếm/lọc)
router.get("/", getProperties);

// Router lấy chi tiết (Dùng ID để xác định căn hộ)
router.get(":/id", getPropertyById);

export default router;