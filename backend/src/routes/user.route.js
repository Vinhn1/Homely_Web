import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";
import { getProfile, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

// Cấu hình Multer lưu vào bộ nhớ tạm (Buffer)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB
});

// Route lấy thông tin cá nhân (Đã đăng nhập)
router.get("/profile", protect, getProfile);

// Route cập nhật thông tin + upload ảnh
router.put("/profile", protect, upload.single("avatar"), updateProfile);

export default router;
