import express from 'express';
import { register } from '../controllers/auth.controller.js';


const router = express.Router();

// Đ/N tuyến đường 
router.post('/register', register);

export default router;