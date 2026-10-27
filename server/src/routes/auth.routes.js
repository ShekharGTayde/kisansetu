import { Router } from 'express'
import { register, login, getMe, logout } from '../controllers/auth.controller.js'
import { validateBody } from '../middleware/validate.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'

const router = Router()

router.post('/register', validateBody(registerSchema), register)
router.post('/login', validateBody(loginSchema), login)
router.get('/me', getMe)
router.post('/logout', logout)

export default router
