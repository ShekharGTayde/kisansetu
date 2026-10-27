import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { sendSuccess, sendError } from './utils/response.js'

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
  sendSuccess(res, {
    status: 'ok',
    service: 'AgriPact API',
    timestamp: new Date().toISOString(),
  })
})

// Central 404 handler
app.use((req, res) => {
  sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, 404)
})

// Central error handler
app.use((err, req, res, _next) => {
  // Handle malformed JSON body
  if (err instanceof SyntaxError && (err.status === 400 || err.statusCode === 400) && 'body' in err) {
    return sendError(res, 'BAD_REQUEST', 'Invalid JSON payload received', 400)
  }

  // Handle Mongoose / Zod / Application errors
  const status = err.status || err.statusCode || 500
  const code = err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR')
  const message = err.message || 'An unexpected error occurred'
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined

  if (process.env.NODE_ENV !== 'test' && status === 500) {
    console.error('Unhandled Server Error:', err)
  }

  sendError(res, code, message, status, details)
})

export default app
