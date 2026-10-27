import dotenv from 'dotenv'
import app from './app.js'
import { connectDB } from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await connectDB()
    }
    const server = app.listen(PORT, () => {
      console.log(`🚀 AgriPact server running on port ${PORT}`)
    })
    return server
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

const server = startServer()

export default server
