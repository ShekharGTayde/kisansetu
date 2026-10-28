import { verifyToken } from '../utils/token.js'
import { sendError } from '../utils/response.js'

/**
 * JWT Authentication Middleware
 * Extracts and verifies Bearer token, sets req.user = { id, role, email, name }
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'UNAUTHORIZED', 'Authentication token required', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyToken(token)
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    }
    next()
  } catch {
    return sendError(res, 'UNAUTHORIZED', 'Invalid or expired authentication token', 401)
  }
}

/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts access to specified roles (e.g. 'farmer', 'buyer')
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication required', 401)
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'FORBIDDEN', `Access forbidden: requires ${allowedRoles.join(' or ')} role`, 403)
    }

    next()
  }
}

/**
 * Resource ownership validator helper
 */
export const isOwner = (resourceOwnerId, reqUserId) => {
  if (!resourceOwnerId || !reqUserId) return false
  const ownerId = resourceOwnerId._id || resourceOwnerId
  const userId = reqUserId._id || reqUserId
  return ownerId.toString() === userId.toString()
}
