import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agripact_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercept 401s and standardize error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agripact_token')
    }
    const standardError = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'An unexpected error occurred',
    }
    return Promise.reject(standardError)
  }
)

export default api
