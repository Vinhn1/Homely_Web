import express from 'express';
import { signUp, signIn, getMe, requestOwnerRole } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import rateLimit from 'express-rate-limit';

// Rate limiter chặt chẽ cho auth — chống brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10,                   // tối đa 10 lần/15phút/IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.' },
});

const router = express.Router();

// Đ/N tuyến đường
router.post('/signUp', authLimiter, signUp);
router.post('/signup', authLimiter, signUp); // Alias
router.post('/signIn', authLimiter, signIn);
router.post('/signin', authLimiter, signIn); // Alias
router.get('/me', protect, getMe);
router.post('/request-owner', protect, requestOwnerRole);

export default router;