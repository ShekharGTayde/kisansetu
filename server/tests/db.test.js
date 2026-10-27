import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { connectDB, disconnectDB } from '../src/config/db.js'

describe('Database Connection Manager', () => {
  let mongoServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
  }, 60000)

  afterAll(async () => {
    await disconnectDB()
    if (mongoServer) {
      await mongoServer.stop()
    }
  }, 30000)

  it('should successfully connect to mongodb instance using connectDB', async () => {
    const uri = mongoServer.getUri()
    await connectDB(uri)
    expect(mongoose.connection.readyState).toBe(1)
  })

  it('should disconnect cleanly with disconnectDB', async () => {
    await disconnectDB()
    expect(mongoose.connection.readyState).toBe(0)
  })
})
