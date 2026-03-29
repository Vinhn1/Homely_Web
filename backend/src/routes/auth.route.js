import express from 'express';
import { signUp, signIn, getMe } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

// Đ/N tuyến đường 
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/me', verifyToken, getMe);

export default router;