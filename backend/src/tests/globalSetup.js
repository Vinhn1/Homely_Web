/**
 * globalSetup.js — Chạy MỘT LẦN trước tất cả test suites
 * Kết nối MongoDB và giữ kết nối trong suốt quá trình test
 * 
 * File này ở: backend/src/tests/globalSetup.js
 * .env ở:     backend/.env  (2 levels up)
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.resolve(__dirname, '../../.env');

export async function setup() {
  dotenv.config({ path: ENV_PATH });

  const mongoose = await import('mongoose');
  const uri = process.env.MONGO_URL; // backend/.env dùng MONGO_URL

  if (!uri) {
    console.warn('\n⚠️  [TEST] MONGO_URL không tìm thấy trong .env\n');
    return;
  }

  await mongoose.default.connect(uri);
  console.log('\n✅ [TEST] MongoDB connected\n');
}

export async function teardown() {
  const mongoose = await import('mongoose');
  if (mongoose.default.connection.readyState !== 0) {
    await mongoose.default.connection.close();
    console.log('\n🔌 [TEST] MongoDB disconnected\n');
  }
}
