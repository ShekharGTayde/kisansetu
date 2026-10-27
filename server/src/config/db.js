import mongoose from 'mongoose'

export const connectDB = async (uri = process.env.MONGO_URI) => {
  if (!uri) {
    throw new Error('MONGO_URI is not defined in environment variables')
  }

  // Prevent multiple connections in testing or dev reload
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail-fast timeout
    })
    console.log(`🍃 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    throw error
  }
}

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('🍃 MongoDB disconnected')
  }
}
