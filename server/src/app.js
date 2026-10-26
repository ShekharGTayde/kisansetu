import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

// Security and middleware
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Health route conforming to standard envelope
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'AgriPact API',
      timestamp: new Date().toISOString(),
    },
    error: null,
  })
})

// Central 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  })
})

// Central error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled Server Error:', err)
  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  })
})

export default app
