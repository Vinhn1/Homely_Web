/**
 * property.test.js — Integration tests cho Property API
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Property API', () => {

  // --- GET PROPERTIES ---
  describe('GET /api/properties', () => {
    it('✅ Trả về danh sách properties với pagination metadata', async () => {
      const res = await request(app).get('/api/properties');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      // Kiểm tra pagination fields
      expect(res.body).toHaveProperty('page');
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('limit');
    });

    it('✅ Pagination hoạt động đúng với ?page=1&limit=3', async () => {
      const res = await request(app).get('/api/properties?page=1&limit=3');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(3);
      expect(res.body.limit).toBe(3);
      expect(res.body.page).toBe(1);
    });

    it('✅ Tìm kiếm bằng search query', async () => {
      const res = await request(app).get('/api/properties?search=phòng');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
    });

    it('✅ Lọc theo giá minPrice', async () => {
      const res = await request(app).get('/api/properties?minPrice=1000000');

      expect(res.status).toBe(200);
      // Mọi property phải có giá >= 1,000,000
      res.body.data.forEach(p => {
        expect(p.price).toBeGreaterThanOrEqual(1000000);
      });
    });
  });

  // --- GET PROPERTY BY ID ---
  describe('GET /api/properties/:id', () => {
    it('❌ Trả về 404 nếu ID không tồn tại', async () => {
      const res = await request(app).get('/api/properties/000000000000000000000000');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('❌ Trả về lỗi nếu ID sai định dạng', async () => {
      const res = await request(app).get('/api/properties/invalid-id');

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // --- CREATE PROPERTY (yêu cầu phân quyền) ---
  describe('POST /api/properties (protected)', () => {
    it('❌ Từ chối tạo property khi chưa đăng nhập', async () => {
      const res = await request(app)
        .post('/api/properties')
        .send({ title: 'Test Property', price: 5000000 });

      expect(res.status).toBe(401);
    });
  });

});
