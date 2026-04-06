import express from 'express';
import { signUp, signIn, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Đ/N tuyến đường 
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/me', protect, getMe);

export default router;