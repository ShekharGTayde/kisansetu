import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { Sprout } from 'lucide-react'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8f5] flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#1b3b22] flex items-center justify-center text-emerald-200 animate-pulse">
          <Sprout className="w-6 h-6 animate-spin" />
        </div>
        <p className="font-editorial text-xl text-[#1b3b22]">Loading KisanSetu...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the user's appropriate role dashboard
    const targetDashboard = role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard'
    return <Navigate to={targetDashboard} replace />
  }

  return children
}
