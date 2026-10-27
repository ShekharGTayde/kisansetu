import request from 'supertest'
import app from '../src/app.js'

describe('Server Skeleton & API Envelope Tests', () => {
  it('GET /api/v1/health should return 200 with standard envelope', async () => {
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

  it('GET /api/v1/unknown-endpoint should return 404 with standard envelope', async () => {
    const res = await request(app).get('/api/v1/unknown-endpoint')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.data).toBeNull()
    expect(res.body.error.code).toBe('NOT_FOUND')
    expect(res.body.error.message).toMatch(/not found/i)
  })

  it('POST with malformed JSON body should return 400 with standard error envelope', async () => {
    const res = await request(app)
      .post('/api/v1/health')
      .set('Content-Type', 'application/json')
      .send('{ "badJson": ')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      success: false,
      data: null,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid JSON payload received',
      },
    })
  })
})
