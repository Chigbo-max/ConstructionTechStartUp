const request = require('supertest');
const app = require('../../index');
const { getAuthToken } = require('../utils/testUtils');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    test('should register a new homeowner', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'marybruce@gmail.com',
          password: 'password',
          firstName: 'Mary',
          lastName: 'Bruce',
          roles: ['HOMEOWNER']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    test('should reject invalid role', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
          roles: ['INVALID_ROLE']
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'marybruce@gmail.com',
          password: 'password'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    test('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'homeowner@test.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  // Password reset tests
  describe('POST /forgot-password', () => {
    test('should request password reset for valid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('password reset link has been sent');
    });

    test('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });

    test('should return 400 for empty email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email is required');
    });
  });

  describe('POST /reset-password', () => {
    test('should return 400 for invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          token: 'invalid-reset-token',
          newPassword: 'newPassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      // The actual error message depends on the service implementation
      expect(['Invalid or expired reset token', 'Reset token has expired']).toContain(response.body.message);
    });

    test('should return 400 for missing token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ newPassword: 'newPassword123' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Token and new password are required');
    });

    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ token: 'valid-reset-token' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Token and new password are required');
    });

    test('should return 400 for short password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          token: 'valid-reset-token',
          newPassword: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Password must be at least 8 characters long');
    });
  });
});