import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../src/app.js'

describe('Core contract flow', () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
  }, 60000)

  afterAll(async () => {
    await mongoose.disconnect()
    if (mongoServer) await mongoServer.stop()
  }, 30000)

  it('registers parties, publishes, offers, accepts, and confirms a contract', async () => {
    const future = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
    const buyer = await request(app).post('/api/v1/auth/register').send({
      name: 'Flow Buyer', email: 'flow.buyer@example.com', phone: '9000000001', password: 'Buyer@123', role: 'buyer', location: 'Indore',
    })
    const farmer = await request(app).post('/api/v1/auth/register').send({
      name: 'Flow Farmer', email: 'flow.farmer@example.com', phone: '9000000002', password: 'Farmer@123', role: 'farmer', location: 'Sehore',
    })
    const buyerToken = buyer.body.data.token
    const farmerToken = farmer.body.data.token

    const listing = await request(app).post('/api/v1/listings').set('Authorization', `Bearer ${buyerToken}`).send({
      crop: 'Wheat', variety: 'Sharbati', quantity: 100, unit: 'quintal',
      priceTerms: { pricePerUnit: 300000 }, deliveryLocation: 'Sehore', deliveryDate: future, paymentTerms: 'On delivery',
    })
    expect(listing.status).toBe(201)

    const offer = await request(app).post(`/api/v1/listings/${listing.body.data._id}/offers`).set('Authorization', `Bearer ${farmerToken}`).send({
      proposedPrice: 295000, quantity: 40, deliveryDate: future, note: 'Ready to commit',
    })
    expect(offer.status).toBe(201)

    const accepted = await request(app).post(`/api/v1/offers/${offer.body.data._id}/accept`).set('Authorization', `Bearer ${buyerToken}`)
    expect(accepted.status).toBe(200)
    const contracts = await request(app).get('/api/v1/contracts/mine').set('Authorization', `Bearer ${buyerToken}`)
    expect(contracts.body.data).toHaveLength(1)

    const contractId = contracts.body.data[0]._id
    const farmerConfirmation = await request(app).post(`/api/v1/contracts/${contractId}/confirm`).set('Authorization', `Bearer ${farmerToken}`)
    expect(farmerConfirmation.body.data.status).toBe('pending_confirmation')
    const buyerConfirmation = await request(app).post(`/api/v1/contracts/${contractId}/confirm`).set('Authorization', `Bearer ${buyerToken}`)
    expect(buyerConfirmation.body.data.status).toBe('active')
  }, 60000)
})
