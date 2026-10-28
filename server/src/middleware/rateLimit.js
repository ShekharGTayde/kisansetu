const attempts = new Map()

export const loginRateLimit = (req, res, next) => {
  const key = `${req.ip}:${String(req.body?.email || '').toLowerCase()}`
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxAttempts = 10
  const current = attempts.get(key)
  if (!current || now - current.startedAt > windowMs) {
    attempts.set(key, { startedAt: now, count: 1 })
    return next()
  }
  if (current.count >= maxAttempts) {
    return res.status(429).json({
      success: false,
      data: null,
      error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Try again later.' },
    })
  }
  current.count += 1
  return next()
}
