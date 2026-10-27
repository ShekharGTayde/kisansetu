import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sprout, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth.js'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const user = await login(formData.email, formData.password)
      const destination = location.state?.from?.pathname || (user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard')
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e1e8e2] shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1b3b22] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[#15261b]">
            Welcome Back
          </h1>
          <p className="text-xs text-[#526a57] mt-1">
            Sign in to access your pre-crop contracts and requirements
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2b4432] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7d9483] absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] focus:ring-1 focus:ring-[#1b3b22] bg-[#fbfdfb]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b4432] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7d9483] absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] focus:ring-1 focus:ring-[#1b3b22] bg-[#fbfdfb]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-forest-pill w-full py-3 text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#526a57] border-t border-[#edf2ee] pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#1b3b22] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  )
}
