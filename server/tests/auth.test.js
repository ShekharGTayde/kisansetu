import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../src/app.js'
import User from '../src/models/User.js'

describe('Authentication API (/api/v1/auth)', () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  }, 60000)

  afterAll(async () => {
    await mongoose.disconnect()
    if (mongoServer) {
      await mongoServer.stop()
    }
  }, 30000)

  afterEach(async () => {
    await User.deleteMany({})
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a farmer successfully and return token with role', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Mukesh Sharma',
          email: 'mukesh@farmer.in',
          phone: '9876543210',
          password: 'Password123',
          role: 'farmer',
          location: 'Sehore, MP',
          farmDetails: {
            cropsGrown: ['Wheat'],
            totalAcres: 8,
          },
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.role).toBe('farmer')
      expect(res.body.data.user.email).toBe('mukesh@farmer.in')
      expect(res.body.data.user.passwordHash).toBeUndefined()
    })

    it('should register a buyer successfully with businessName', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Anjali Verma',
          email: 'anjali@agrocorp.com',
          phone: '9123456789',
          password: 'Password123',
          role: 'buyer',
          location: 'Delhi',
          businessName: 'AgroCorp India Pvt Ltd',
        })

      expect(res.status).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.role).toBe('buyer')
      expect(res.body.data.user.businessName).toBe('AgroCorp India Pvt Ltd')
    })

    it('should reject registration with duplicate email (409)', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'First User',
          email: 'duplicate@test.com',
          phone: '9876543210',
          password: 'Password123',
          role: 'farmer',
          location: 'Bhopal',
        })

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Second User',
          email: 'duplicate@test.com',
          phone: '9876543211',
          password: 'Password123',
          role: 'buyer',
          location: 'Indore',
        })

      expect(res.status).toBe(409)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('EMAIL_EXISTS')
    })

    it('should reject invalid role in registration (400 validation error)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Invalid Role',
          email: 'invalid@role.com',
          phone: '9876543210',
          password: 'Password123',
          role: 'admin',
          location: 'Pune',
        })

      expect(res.status).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('VALIDATION_ERROR')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Dev Farmer',
          email: 'farmer@test.com',
          phone: '9876543210',
          password: 'SecurePassword123',
          role: 'farmer',
          location: 'Punjab',
        })
    })

    it('should log in with valid credentials and return JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'farmer@test.com',
          password: 'SecurePassword123',
        })

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
      expect(res.body.data.user.email).toBe('farmer@test.com')
      expect(res.body.data.user.passwordHash).toBeUndefined()
    })

    it('should reject incorrect password (401)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'farmer@test.com',
          password: 'WrongPassword',
        })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
    })

    it('should reject non-existent email (401)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'notfound@test.com',
          password: 'SomePassword123',
        })

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS')
    })
  })

  describe('GET /api/v1/auth/me', () => {
    let token

    beforeEach(async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Me User',
          email: 'me@test.com',
          phone: '9876543210',
          password: 'Password123',
          role: 'buyer',
          location: 'Mumbai',
        })
      token = reg.body.data.token
    })

    it('should return current user when valid bearer token is provided', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.user.email).toBe('me@test.com')
      expect(res.body.data.user.role).toBe('buyer')
    })

    it('should return 401 when token is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    it('should return 401 when token is invalid or corrupt', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.token.string')

      expect(res.status).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('should return 200 with standard success envelope', async () => {
      const res = await request(app).post('/api/v1/auth/logout')
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data.message).toMatch(/logged out/i)
    })
  })
})
