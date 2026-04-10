import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { submitReport } from '../controllers/admin.controller.js';

const router = express.Router();

// POST /api/reports — Người dùng đăng nhập gửi báo cáo vi phạm
router.post('/', protect, submitReport);

export default router;
