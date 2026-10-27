import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sprout, LogOut, ChevronDown, PlusCircle } from 'lucide-react'
import { useAuth } from '../context/useAuth.js'

export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApiStatus('online')
        } else {
          setApiStatus('offline')
        }
      })
      .catch(() => {
        setApiStatus('offline')
      })
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4">
      <nav className="floating-pill-nav w-full max-w-5xl h-14 md:h-16 rounded-full px-3 md:px-5 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1b3b22] flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <span className="font-editorial text-xl md:text-2xl font-bold tracking-tight text-[#15261b]">
            KisanSetu
          </span>
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#465b4c]">
          <Link
            to="/"
            className={`hover:text-[#1b3b22] transition-colors ${
              isActive('/') ? 'text-[#1b3b22] font-semibold' : ''
            }`}
          >
            Home
          </Link>

          {/* Role specific links */}
          {isAuthenticated && role === 'farmer' && (
            <>
              <Link
                to="/farmer/dashboard"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/farmer/dashboard') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                Farmer Dashboard
              </Link>
              <Link
                to="/listings"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/listings') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                Crop Requirements
              </Link>
              <Link
                to="/contracts"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/contracts') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                My Contracts
              </Link>
            </>
          )}

          {isAuthenticated && role === 'buyer' && (
            <>
              <Link
                to="/buyer/dashboard"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/buyer/dashboard') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                Buyer Dashboard
              </Link>
              <Link
                to="/buyer/listings"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/buyer/listings') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                My Requirements
              </Link>
              <Link
                to="/buyer/listings/new"
                className={`hover:text-[#1b3b22] transition-colors flex items-center gap-1 ${
                  isActive('/buyer/listings/new') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#1b3b22]" /> Post Requirement
              </Link>
              <Link
                to="/contracts"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/contracts') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                Contracts
              </Link>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/listings"
                className={`hover:text-[#1b3b22] transition-colors ${
                  isActive('/listings') ? 'text-[#1b3b22] font-semibold' : ''
                }`}
              >
                Marketplace
              </Link>
              <a href="/#explore-flow" className="hover:text-[#1b3b22] transition-colors flex items-center gap-1">
                How It Works <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </a>
            </>
          )}
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#56695b] mr-1">
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-emerald-600' : 'bg-amber-500'
              } pulse-dot`}
            ></span>
            <span className="font-mono uppercase text-[10px] tracking-wider">
              {apiStatus}
            </span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#15261b] leading-tight truncate max-w-[120px]">
                  {user?.name}
                </span>
                <span className="text-[10px] font-mono capitalize tracking-wide text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded-full self-end border border-emerald-200">
                  {role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Log Out"
                className="w-9 h-9 rounded-full bg-[#edf2ee] hover:bg-[#dfe7e0] flex items-center justify-center text-[#2b4432] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs md:text-sm font-medium text-[#1b3b22] px-3 py-1.5 hover:underline"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-forest-pill text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
