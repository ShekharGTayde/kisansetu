import request from 'supertest'
import app from '../src/app.js'

describe('GET /api/v1/health', () => {
  it('should return 200 with standard envelope', async () => {
    const res = await request(app).get('/api/v1/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      success: true,
      data: {
        status: 'ok',
        service: 'AgriPact API',
        timestamp: expect.any(String),
      },
      error: null,
    })
  })

  it('should return 404 with standard envelope for unknown route', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.error.code).toBe('NOT_FOUND')
  })
})
