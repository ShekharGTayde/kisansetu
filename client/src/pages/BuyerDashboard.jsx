import React from 'react'
import { Link } from 'react-router-dom'
import { Building2, PlusCircle, FileText, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/useAuth.js'

export default function BuyerDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#1b3b22] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-full text-xs text-emerald-200 mb-3">
            <Building2 className="w-3.5 h-3.5" /> Institutional Buyer Portal
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-normal mb-2">
            Welcome, <span className="italic">{user?.businessName || user?.name || 'Buyer'}</span>
          </h1>
          <p className="text-emerald-100/80 text-sm md:text-base leading-relaxed">
            Post pre-crop procurement specifications, review offers from regional farmers, counter-propose
            fair terms, and secure supply stability ahead of the sowing season.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/buyer/listings/new"
              className="bg-white text-[#1b3b22] hover:bg-emerald-50 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 shadow"
            >
              <PlusCircle className="w-4 h-4" /> Post New Requirement
            </Link>
            <Link
              to="/buyer/listings"
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-600/50 px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> My Requirements
            </Link>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#e1e8e2] shadow-sm">
          <span className="text-xs font-semibold text-[#6d8474] uppercase tracking-wider">
            Active Listings
          </span>
          <div className="text-3xl font-editorial font-bold text-[#15261b] mt-2">4</div>
          <p className="text-xs text-[#526a57] mt-1">Accepting farmer proposals</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e1e8e2] shadow-sm">
          <span className="text-xs font-semibold text-[#6d8474] uppercase tracking-wider">
            Pending Negotiations
          </span>
          <div className="text-3xl font-editorial font-bold text-[#15261b] mt-2">2</div>
          <p className="text-xs text-[#526a57] mt-1">Active counter threads</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#e1e8e2] shadow-sm">
          <span className="text-xs font-semibold text-[#6d8474] uppercase tracking-wider">
            Total Committed
          </span>
          <div className="text-3xl font-editorial font-bold text-[#1b3b22] mt-2">2,250 Qtl</div>
          <p className="text-xs text-[#526a57] mt-1">Pre-sowing volume secured</p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#15261b] mb-2">
              Procurement Listings
            </h3>
            <p className="text-sm text-[#4a6150] mb-4">
              Manage your published crop requirements, adjust target delivery dates and pricing, or pause
              fulfilled listings.
            </p>
          </div>
          <Link
            to="/buyer/listings"
            className="text-xs font-semibold text-[#1b3b22] hover:underline flex items-center gap-1 self-start"
          >
            Manage Listings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-[#15261b] mb-2">
              Contracts & Delivery
            </h3>
            <p className="text-sm text-[#4a6150] mb-4">
              Review signed farmer contracts, verify agreed quality parameters and delivery schedules, and
              export official PDF agreements.
            </p>
          </div>
          <Link
            to="/contracts"
            className="text-xs font-semibold text-[#1b3b22] hover:underline flex items-center gap-1 self-start"
          >
            View Contracts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
