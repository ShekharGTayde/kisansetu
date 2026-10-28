import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'
import RequirementListing from '../models/RequirementListing.js'
import { connectDB, disconnectDB } from '../config/db.js'

dotenv.config()

export const seedDatabase = async () => {
  try {
    await connectDB()

    // Create demo Farmer
    const existingFarmer = await User.findOne({ email: 'farmer@kisansetu.in' })
    if (!existingFarmer) {
      const farmerHash = await User.hashPassword('Farmer@123')
      await User.create({
        name: 'Ramesh Patel',
        email: 'farmer@kisansetu.in',
        phone: '9876543210',
        passwordHash: farmerHash,
        role: 'farmer',
        location: 'Sehore, Madhya Pradesh',
        farmDetails: {
          cropsGrown: ['Wheat', 'Soybean', 'Mustard'],
          totalAcres: 15,
        },
      })
      console.log('✅ Demo farmer created: farmer@kisansetu.in / Farmer@123')
    }

    // Create demo Buyer
    const existingBuyer = await User.findOne({ email: 'buyer@itcagri.com' })
    if (!existingBuyer) {
      const buyerHash = await User.hashPassword('Buyer@123')
      await User.create({
        name: 'Suresh Kumar',
        email: 'buyer@itcagri.com',
        phone: '9123456780',
        passwordHash: buyerHash,
        role: 'buyer',
        location: 'Indore, Madhya Pradesh',
        businessName: 'ITC Agri-Business Division',
      })
      console.log('✅ Demo buyer created: buyer@itcagri.com / Buyer@123')
    }

    const buyer = await User.findOne({ email: 'buyer@itcagri.com' })
    const existingListing = await RequirementListing.findOne({ buyerId: buyer._id, crop: 'Wheat (Sharbati)' })
    if (!existingListing) {
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 60)
      const validTill = new Date()
      validTill.setDate(validTill.getDate() + 30)
      await RequirementListing.create({
        buyerId: buyer._id,
        crop: 'Wheat (Sharbati)',
        variety: 'Sharbati',
        quantity: 500,
        unit: 'quintal',
        qualitySpec: { grade: 'Grade A', moistureMax: '12%' },
        priceTerms: { pricePerUnit: 325000 },
        deliveryLocation: 'Sehore, Madhya Pradesh',
        deliveryDate,
        paymentTerms: '30% advance, balance on delivery',
        validTill,
      })
      console.log('✅ Demo wheat requirement created')
    }

    console.log('🌱 Seed completed successfully.')
  } catch (error) {
    console.error('Seed error:', error)
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await disconnectDB()
    }
  }
}

// Run standalone if called directly
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
}
