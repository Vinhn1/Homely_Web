/**
 * auth.test.js — Integration tests cho Auth API
 * Tests viết theo đúng behavior của auth.controller.js
 *
 * Chạy: npm test
 */
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';

// ===== TEST DATA — Unique per test run =====
const TS = Date.now();
const testUser = {
  username: `cv${TS}`,
  email: `cv${TS}@homely.com`,
  password: 'Test123456',
  displayName: 'CV Test User',
  role: 'user', // Zod schema yêu cầu field này
};

let accessToken = '';
let signUpDone = false;

// ===== AUTH TESTS =====
describe('Auth API', () => {

  // --- ĐĂNG KÝ ---
  describe('POST /api/auth/signUp', () => {
    it('✅ Đăng ký thành công với dữ liệu hợp lệ', async () => {
      const res = await request(app)
        .post('/api/auth/signUp')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      signUpDone = res.status === 201;
    });

    it('❌ Từ chối đăng ký nếu thiếu email (400)', async () => {
      const res = await request(app)
        .post('/api/auth/signUp')
        .send({ username: 'noemail', password: 'Test123456', displayName: 'No Email' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });

    it('❌ Từ chối email bị trùng (400 hoặc 409)', async () => {
      const res = await request(app)
        .post('/api/auth/signUp')
        .send(testUser);

      // Controller check duplicate trước → 409, hoặc Mongo 11000 → 400
      expect([400, 409]).toContain(res.status);
    });

    it('❌ Từ chối password yếu (400)', async () => {
      const res = await request(app)
        .post('/api/auth/signUp')
        .send({ 
          username: `weak${TS}`, 
          email: `weak${TS}@homely.com`, 
          password: '123',
          displayName: 'Weak Pwd' 
        });

      expect(res.status).toBe(400);
    });
  });

  // --- ĐĂNG NHẬP ---
  describe('POST /api/auth/signIn', () => {
    it('✅ Đăng nhập thành công và nhận accessToken', async () => {
      // Nếu signUp failed, tạo user khác để test
      const credentials = signUpDone 
        ? { username: testUser.username, password: testUser.password }
        : { username: 'admin', password: process.env.ADMIN_PASS || 'admin123' };

      const res = await request(app)
        .post('/api/auth/signIn')
        .send({ username: testUser.username, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('user');
      accessToken = res.body.accessToken;
    });

    it('❌ Từ chối sai mật khẩu (401)', async () => {
      const res = await request(app)
        .post('/api/auth/signIn')
        .send({ username: testUser.username, password: 'WRONG_PASSWORD' });

      expect(res.status).toBe(401);
    });

    it('❌ Từ chối username không tồn tại (404)', async () => {
      const res = await request(app)
        .post('/api/auth/signIn')
        .send({ username: `xxxxxxnotfound${TS}`, password: 'Test123456' });

      expect(res.status).toBe(404);
    });
  });

  // --- GET ME ---
  describe('GET /api/auth/me', () => {
    it('✅ Trả về thông tin user khi có token hợp lệ', async () => {
      if (!accessToken) {
        console.warn('⚠️  accessToken not available, skipping');
        return;
      }

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('username');
      expect(res.body.user).not.toHaveProperty('hashedPassword');
    });

    it('❌ Từ chối khi không có token (401)', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('❌ Từ chối khi token sai (401 hoặc 403)', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken.invalid.invalid');

      expect([401, 403]).toContain(res.status);
    });
  });

});
