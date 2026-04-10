/**
 * setup.js — Chạy trước mỗi test file (trong worker process)
 * Load env vars và kết nối DB nếu chưa connected
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { beforeAll, afterAll } from 'vitest';

// setup.js ở: backend/src/tests/setup.js
// .env ở: backend/.env (2 levels up)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

beforeAll(async () => {
  // Backend dùng MONGO_URL (không phải MONGODB_URI)
  const uri = process.env.MONGO_URL;
  if (!uri) {
    console.warn('⚠️  MONGO_URL not found, DB tests will fail');
    return;
  }
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
    console.log('✅ Test DB connected');
  }
}, 30000);

afterAll(async () => {
  // Không đóng ở đây để các test files khác dùng chung kết nối
});
