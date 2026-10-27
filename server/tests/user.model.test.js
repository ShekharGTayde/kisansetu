import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import User from '../src/models/User.js'

describe('User Model Tests', () => {
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

  it('should successfully create a farmer user with farmDetails', async () => {
    const hash = await User.hashPassword('Secret123')
    const user = await User.create({
      name: 'Ramesh Patel',
      email: 'ramesh@kisansetu.in',
      phone: '9876543210',
      passwordHash: hash,
      role: 'farmer',
      location: 'Sehore, Madhya Pradesh',
      farmDetails: {
        cropsGrown: ['Wheat', 'Soybean'],
        totalAcres: 12,
      },
    })

    expect(user._id).toBeDefined()
    expect(user.role).toBe('farmer')
    expect(user.farmDetails.cropsGrown).toContain('Wheat')
    expect(await user.comparePassword('Secret123')).toBe(true)
    expect(await user.comparePassword('WrongPassword')).toBe(false)
  })

  it('should successfully create a buyer user with businessName', async () => {
    const hash = await User.hashPassword('BuyerPass123')
    const user = await User.create({
      name: 'Priya Sharma',
      email: 'priya@itcagri.com',
      phone: '9123456780',
      passwordHash: hash,
      role: 'buyer',
      location: 'Indore, Madhya Pradesh',
      businessName: 'ITC Agri-Business Ltd',
    })

    expect(user._id).toBeDefined()
    expect(user.role).toBe('buyer')
    expect(user.businessName).toBe('ITC Agri-Business Ltd')
  })

  it('should reject invalid role', async () => {
    const hash = await User.hashPassword('Pass1234')
    await expect(
      User.create({
        name: 'Invalid User',
        email: 'invalid@example.com',
        phone: '9999999999',
        passwordHash: hash,
        role: 'admin', // invalid
        location: 'Delhi',
      })
    ).rejects.toThrow(/Role must be either farmer or buyer/)
  })

  it('should reject duplicate email', async () => {
    // Ensure index is built
    await User.init()

    const hash = await User.hashPassword('Pass1234')
    await User.create({
      name: 'User 1',
      email: 'duplicate@example.com',
      phone: '9876543210',
      passwordHash: hash,
      role: 'farmer',
      location: 'Punjab',
    })

    await expect(
      User.create({
        name: 'User 2',
        email: 'duplicate@example.com',
        phone: '9876543211',
        passwordHash: hash,
        role: 'buyer',
        location: 'Haryana',
      })
    ).rejects.toThrow()
  })

  it('should never expose passwordHash in toJSON output', async () => {
    const hash = await User.hashPassword('SuperSecret')
    const user = await User.create({
      name: 'Hidden Pass',
      email: 'hidden@example.com',
      phone: '9876543212',
      passwordHash: hash,
      role: 'farmer',
      location: 'Madhya Pradesh',
    })

    const json = user.toJSON()
    expect(json.passwordHash).toBeUndefined()
    expect(json.name).toBe('Hidden Pass')
  })
})
