import request from 'supertest'
import app from '../src/app.js'
import { generateToken } from '../src/utils/token.js'
import { isOwner } from '../src/middleware/auth.js'

describe('Auth & Role Middleware (/api/v1/test/*)', () => {
  const farmerToken = generateToken({
    id: '64f1a2b3c4d5e6f7a8b9c0d1',
    role: 'farmer',
    email: 'farmer@test.com',
    name: 'Farmer Test',
  })

  const buyerToken = generateToken({
    id: '64f1a2b3c4d5e6f7a8b9c0d2',
    role: 'buyer',
    email: 'buyer@test.com',
    name: 'Buyer Test',
  })

  describe('Authentication Enforcement', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/test/farmer-only')
      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    it('should return 401 when token is invalid or corrupt', async () => {
      const res = await request(app)
        .get('/api/v1/test/farmer-only')
        .set('Authorization', 'Bearer invalid-token-string')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('Role-Based Authorization (RBAC)', () => {
    it('should allow farmer to access farmer-only route (200)', async () => {
      const res = await request(app)
        .get('/api/v1/test/farmer-only')
        .set('Authorization', `Bearer ${farmerToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.message).toBe('Farmer access granted')
      expect(res.body.data.user.role).toBe('farmer')
    })

    it('should forbid buyer from accessing farmer-only route (403)', async () => {
      const res = await request(app)
        .get('/api/v1/test/farmer-only')
        .set('Authorization', `Bearer ${buyerToken}`)

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })

    it('should allow buyer to access buyer-only route (200)', async () => {
      const res = await request(app)
        .get('/api/v1/test/buyer-only')
        .set('Authorization', `Bearer ${buyerToken}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.message).toBe('Buyer access granted')
      expect(res.body.data.user.role).toBe('buyer')
    })

    it('should forbid farmer from accessing buyer-only route (403)', async () => {
      const res = await request(app)
        .get('/api/v1/test/buyer-only')
        .set('Authorization', `Bearer ${farmerToken}`)

      expect(res.status).toBe(403)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('FORBIDDEN')
    })
  })

  describe('Ownership Helper (isOwner)', () => {
    it('should return true for matching IDs', () => {
      expect(isOwner('user-123', 'user-123')).toBe(true)
    })

    it('should return false for different IDs', () => {
      expect(isOwner('user-123', 'user-456')).toBe(false)
    })

    it('should return false for missing parameters', () => {
      expect(isOwner(null, 'user-123')).toBe(false)
      expect(isOwner('user-123', null)).toBe(false)
    })
  })
})
