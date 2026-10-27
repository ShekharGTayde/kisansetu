import User from '../models/User.js'
import { generateToken, verifyToken } from '../utils/token.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, location, farmDetails, businessName } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return sendError(res, 'EMAIL_EXISTS', 'A user with this email already exists', 409)
    }

    const passwordHash = await User.hashPassword(password)

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role,
      location,
      farmDetails: role === 'farmer' ? farmDetails : undefined,
      businessName: role === 'buyer' ? businessName : undefined,
    })

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    })

    return sendSuccess(
      res,
      {
        user: user.toJSON(),
        token,
      },
      201
    )
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password', 401)
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    })

    return sendSuccess(res, {
      user: user.toJSON(),
      token,
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'UNAUTHORIZED', 'Authentication token missing or invalid', 401)
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = verifyToken(token)
    } catch {
      return sendError(res, 'UNAUTHORIZED', 'Invalid or expired authentication token', 401)
    }

    const user = await User.findById(decoded.id)
    if (!user) {
      return sendError(res, 'NOT_FOUND', 'User no longer exists', 404)
    }

    return sendSuccess(res, {
      user: user.toJSON(),
    })
  } catch (error) {
    next(error)
  }
}

export const logout = async (_req, res) => {
  return sendSuccess(res, { message: 'Logged out successfully' })
}
