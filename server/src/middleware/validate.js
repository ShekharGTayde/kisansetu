import { sendError } from '../utils/response.js'

export const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return sendError(res, 'VALIDATION_ERROR', 'Request validation failed', 400, formattedErrors)
    }
    req.body = result.data
    next()
  }
}
