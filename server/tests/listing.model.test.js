import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import RequirementListing from '../src/models/RequirementListing.js'

describe('RequirementListing Model Tests', () => {
  let mongoServer
  const mockBuyerId = new mongoose.Types.ObjectId()

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
    await RequirementListing.deleteMany({})
  })

  it('should successfully create a valid requirement listing', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    const listing = await RequirementListing.create({
      buyerId: mockBuyerId,
      crop: 'Wheat (Sharbati)',
      variety: 'Sharbati',
      quantity: 500,
      unit: 'quintal',
      qualitySpec: {
        grade: 'Grade A',
        moistureMax: '12%',
      },
      priceTerms: {
        pricePerUnit: 325000, // 3,250 INR in paise
      },
      deliveryLocation: 'Sehore, Madhya Pradesh',
      deliveryDate: futureDate,
      paymentTerms: '30% Advance at sowing, 70% on delivery',
      status: 'open',
    })

    expect(listing._id).toBeDefined()
    expect(listing.crop).toBe('Wheat (Sharbati)')
    expect(listing.quantity).toBe(500)
    expect(listing.remainingQuantity).toBe(500)
    expect(listing.status).toBe('open')
  })

  it('should reject non-positive quantity', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)

    await expect(
      RequirementListing.create({
        buyerId: mockBuyerId,
        crop: 'Rice',
        quantity: 0,
        unit: 'quintal',
        priceTerms: { pricePerUnit: 400000 },
        deliveryLocation: 'Karnal',
        deliveryDate: futureDate,
        paymentTerms: 'Payment on delivery',
      })
    ).rejects.toThrow(/Quantity must be at least 1/)
  })

  it('should reject deliveryDate in the past', async () => {
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 5)

    await expect(
      RequirementListing.create({
        buyerId: mockBuyerId,
        crop: 'Mustard',
        quantity: 100,
        unit: 'quintal',
        priceTerms: { pricePerUnit: 500000 },
        deliveryLocation: 'Alwar',
        deliveryDate: pastDate,
        paymentTerms: 'Net 15 days',
      })
    ).rejects.toThrow(/Delivery date must be in the future/)
  })

  it('should reject invalid status', async () => {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 20)

    await expect(
      RequirementListing.create({
        buyerId: mockBuyerId,
        crop: 'Soybean',
        quantity: 200,
        unit: 'quintal',
        priceTerms: { pricePerUnit: 450000 },
        deliveryLocation: 'Indore',
        deliveryDate: futureDate,
        paymentTerms: 'Advance 50%',
        status: 'archived', // invalid status
      })
    ).rejects.toThrow(/Invalid listing status/)
  })
})
