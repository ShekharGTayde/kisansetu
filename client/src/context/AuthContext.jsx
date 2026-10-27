import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { AuthContext } from './authContextDef.js'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('agripact_token'))
  const [loading, setLoading] = useState(true)

  // Verify and hydrate current user on initial load
  useEffect(() => {
    const hydrateUser = async () => {
      const storedToken = localStorage.getItem('agripact_token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')
        if (response.success && response.data?.user) {
          setUser(response.data.user)
          setToken(storedToken)
        } else {
          localStorage.removeItem('agripact_token')
          setUser(null)
          setToken(null)
        }
      } catch {
        localStorage.removeItem('agripact_token')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    hydrateUser()
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.success && response.data) {
      const { user: authUser, token: authToken } = response.data
      localStorage.setItem('agripact_token', authToken)
      setUser(authUser)
      setToken(authToken)
      return authUser
    }
    throw new Error(response.error?.message || 'Login failed')
  }

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData)
    if (response.success && response.data) {
      const { user: authUser, token: authToken } = response.data
      localStorage.setItem('agripact_token', authToken)
      setUser(authUser)
      setToken(authToken)
      return authUser
    }
    throw new Error(response.error?.message || 'Registration failed')
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      localStorage.removeItem('agripact_token')
      setUser(null)
      setToken(null)
    }
  }

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(user && token),
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
