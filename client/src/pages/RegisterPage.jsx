import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, Building2, Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth.js'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('farmer') // 'farmer' | 'buyer'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    location: '',
    cropsGrown: 'Wheat, Soybean',
    totalAcres: 10,
    businessName: '',
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

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role,
      location: formData.location,
    }

    if (role === 'farmer') {
      payload.farmDetails = {
        cropsGrown: formData.cropsGrown.split(',').map((c) => c.trim()).filter(Boolean),
        totalAcres: Number(formData.totalAcres) || 5,
      }
    } else {
      payload.businessName = formData.businessName || `${formData.name} Trading Ltd`
    }

    try {
      const user = await register(payload)
      const destination = user.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your inputs.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#e1e8e2] shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1b3b22] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <h1 className="font-editorial text-3xl font-bold text-[#15261b]">
            Join KisanSetu
          </h1>
          <p className="text-xs text-[#526a57] mt-1">
            Choose your account role to access tailor-made pre-crop contracts
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#f0f4f0] rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              role === 'farmer'
                ? 'bg-white text-[#1b3b22] shadow-sm border border-[#d6dfd7]'
                : 'text-[#56695b] hover:text-[#1b3b22]'
            }`}
          >
            <Sprout className="w-4 h-4 text-[#1b3b22]" />
            <span>I am a Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              role === 'buyer'
                ? 'bg-white text-[#1b3b22] shadow-sm border border-[#d6dfd7]'
                : 'text-[#56695b] hover:text-[#1b3b22]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#1b3b22]" />
            <span>I am a Buyer</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2b4432] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7d9483] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={role === 'farmer' ? 'Ramesh Patel' : 'Priya Sharma'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] bg-[#fbfdfb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2b4432] mb-1.5 uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7d9483] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] bg-[#fbfdfb]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] bg-[#fbfdfb]"
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
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] bg-[#fbfdfb]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2b4432] mb-1.5 uppercase tracking-wider">
              Location (District, State)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#7d9483] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sehore, Madhya Pradesh"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d6dfd7] text-sm focus:outline-none focus:border-[#1b3b22] bg-[#fbfdfb]"
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'farmer' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f7f9f7] border border-[#e2eae3]">
              <div>
                <label className="block text-xs font-semibold text-[#2b4432] mb-1.5">
                  Crops Grown (comma separated)
                </label>
                <input
                  type="text"
                  name="cropsGrown"
                  value={formData.cropsGrown}
                  onChange={handleChange}
                  placeholder="Wheat, Mustard, Soybean"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#d6dfd7] text-sm bg-white focus:outline-none focus:border-[#1b3b22]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2b4432] mb-1.5">
                  Total Farm Land (Acres)
                </label>
                <input
                  type="number"
                  name="totalAcres"
                  value={formData.totalAcres}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#d6dfd7] text-sm bg-white focus:outline-none focus:border-[#1b3b22]"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#f7f9f7] border border-[#e2eae3]">
              <label className="block text-xs font-semibold text-[#2b4432] mb-1.5">
                Business / Enterprise Legal Name
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. ITC Agri-Business Ltd"
                className="w-full px-3.5 py-2 rounded-xl border border-[#d6dfd7] text-sm bg-white focus:outline-none focus:border-[#1b3b22]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-forest-pill w-full py-3.5 text-sm mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Registering...' : `Register as ${role === 'farmer' ? 'Farmer' : 'Buyer'}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#526a57] border-t border-[#edf2ee] pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#1b3b22] hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
