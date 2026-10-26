import React, { useState, useEffect } from 'react'
import {
  Sprout,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  MapPin,
  Calendar,
  Download,
  Search,
  FileCheck,
  Building2,
  Wheat,
  Clock,
  Sparkles,
} from 'lucide-react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCrop, setSelectedCrop] = useState('all')
  const [apiStatus, setApiStatus] = useState('checking')
  const [contractConfirmed, setContractConfirmed] = useState({ farmer: false, buyer: false })
  const [negotiationStep, setNegotiationStep] = useState(2) // 1: offer, 2: counter, 3: agreed

  useEffect(() => {
    // Health check from backend API
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

  // Sample listings adhering to RequirementListing schema from PRD & TASKS.md
  const sampleListings = [
    {
      id: 'LST-101',
      crop: 'Wheat (Sharbati)',
      buyer: 'ITC Agri-Business',
      location: 'Sehore, Madhya Pradesh',
      quantity: 500,
      unit: 'Quintals',
      pricePerUnit: 3250,
      deliveryDate: '2026-04-15',
      moistureMax: '12%',
      qualityGrade: 'Grade A Export',
      paymentTerms: '30% Advance at sowing, 70% on delivery',
      status: 'open',
    },
    {
      id: 'LST-102',
      crop: 'Basmati Rice (1121)',
      buyer: 'Patanjali Foods Ltd',
      location: 'Karnal, Haryana',
      quantity: 800,
      unit: 'Quintals',
      pricePerUnit: 4100,
      deliveryDate: '2026-10-30',
      moistureMax: '14%',
      qualityGrade: 'Superfine Grain',
      paymentTerms: '25% Advance, 75% post-inspection',
      status: 'open',
    },
    {
      id: 'LST-103',
      crop: 'Yellow Mustard',
      buyer: 'Adani Wilmar Edible Oils',
      location: 'Alwar, Rajasthan',
      quantity: 350,
      unit: 'Quintals',
      pricePerUnit: 5800,
      deliveryDate: '2026-03-25',
      moistureMax: '8%',
      qualityGrade: 'Oil Content > 42%',
      paymentTerms: '40% Sowing support, balance on delivery',
      status: 'open',
    },
    {
      id: 'LST-104',
      crop: 'Soybean (JS-335)',
      buyer: 'Ruchi Soya Industries',
      location: 'Indore, Madhya Pradesh',
      quantity: 600,
      unit: 'Quintals',
      pricePerUnit: 4850,
      deliveryDate: '2026-11-10',
      moistureMax: '10%',
      qualityGrade: 'Certified Non-GMO',
      paymentTerms: '30% Seed input credit, 70% delivery',
      status: 'open',
    },
  ]

  const filteredListings =
    selectedCrop === 'all'
      ? sampleListings
      : sampleListings.filter((l) => l.crop.toLowerCase().includes(selectedCrop.toLowerCase()))

  const toggleConfirm = (role) => {
    setContractConfirmed((prev) => ({
      ...prev,
      [role]: !prev[role],
    }))
  }

  const isContractActive = contractConfirmed.farmer && contractConfirmed.buyer

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#15261b] selection:bg-[#1b3b22] selection:text-white relative">
      {/* 1. FLOATING PILL NAVBAR (Matches reference design) */}
      <header className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="floating-pill-nav w-full max-w-4xl h-14 md:h-16 rounded-full px-3 md:px-5 flex items-center justify-between">
          {/* Logo with forest green rounded squircle */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1b3b22] flex items-center justify-center text-white shadow-sm">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl md:text-2xl font-bold tracking-tight text-[#15261b]">
                KisanSetu
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#465b4c]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`hover:text-[#1b3b22] transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'overview' ? 'text-[#1b3b22] font-semibold' : ''
              }`}
            >
              Features <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`hover:text-[#1b3b22] transition-colors cursor-pointer ${
                activeTab === 'marketplace' ? 'text-[#1b3b22] font-semibold' : ''
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => setActiveTab('negotiation')}
              className={`hover:text-[#1b3b22] transition-colors cursor-pointer ${
                activeTab === 'negotiation' ? 'text-[#1b3b22] font-semibold' : ''
              }`}
            >
              Negotiate & Contract
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`hover:text-[#1b3b22] transition-colors cursor-pointer ${
                activeTab === 'about' ? 'text-[#1b3b22] font-semibold' : ''
              }`}
            >
              About Us
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#56695b] mr-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus === 'online' ? 'bg-emerald-600' : 'bg-amber-500'
                } pulse-dot`}
              ></span>
              <span className="font-mono uppercase text-[10px] tracking-wider">
                API {apiStatus}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('marketplace')}
              className="btn-forest-pill text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5"
            >
              <span>Sign In</span>
            </button>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-28 md:pt-36 pb-8 md:pb-16 px-4 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Subtle pill badge at top */}
        <div className="badge-pill mb-6 md:mb-8">
          <span className="w-2 h-2 rounded-full bg-[#1b3b22] pulse-dot"></span>
          <span className="text-xs tracking-wide text-[#2b4432] font-medium">
            New Advance AI & Pre-Crop Contract Support
          </span>
        </div>

        {/* Large Editorial Headline (Exact Cormorant Garamond font style with italic accent word) */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-normal tracking-tight text-[#15261b] max-w-4xl leading-[1.08] mb-6">
          Find Your Inner Peace,{' '}
          <span className="italic font-normal text-[#1b3b22]">One Contract</span> at a Time!
        </h1>

        {/* Hero CTA Button (Exact rounded pill in dark forest green with sprout icon) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 z-10">
          <a
            href="#explore-flow"
            className="btn-forest-pill px-7 py-3.5 text-sm md:text-base shadow-xl"
          >
            <Sprout className="w-4 h-4 text-emerald-200" />
            <span>Download App</span>
          </a>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="rounded-full px-6 py-3.5 text-sm font-medium text-[#1b3b22] bg-white/70 hover:bg-white border border-[#cad5cb] transition-all shadow-sm"
          >
            Browse Crop Requirements
          </button>
        </div>

        {/* Supporting subtitle */}
        <p className="text-sm md:text-base text-[#465b4c] max-w-xl font-normal leading-relaxed mb-6">
          Reconnect with nature and secure guaranteed crop prices before sowing. KisanSetu links
          progressive farmers and verified buyers with legally binding, transparent contracts.
        </p>

        {/* ROLLING MISTY GREEN HILLS BANNER (Exact background image with misty forest & mountains) */}
        <div className="w-full relative min-h-[440px] md:min-h-[580px] rounded-3xl md:rounded-[40px] overflow-hidden shadow-2xl border border-white/40 flex flex-col justify-end p-6 md:p-12">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
            style={{ backgroundImage: "url('/images/hero-hills.jpg')" }}
          >
            {/* Top gradient to blend with off-white background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8f5] via-transparent to-black/50 opacity-90"></div>
          </div>

          {/* Floating Hero Info Overlay */}
          <div className="relative z-10 max-w-2xl mx-auto text-center text-white pb-6">
            <p className="text-xs md:text-sm font-medium tracking-wide uppercase text-emerald-100/90 mb-2">
              Transparent • Binding • Sowing-to-Harvest Protection
            </p>
            <h2 className="font-editorial text-2xl md:text-4xl text-white font-light tracking-tight mb-4">
              AgriPact Pre-Harvest Guarantee
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/85">
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fixed Sowing Price
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Mutual Turn Negotiation
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> Digital PDF Lock
              </span>
            </div>
          </div>

          {/* Partner & Trust Ribbon (Similar to logoipsum logos in reference) */}
          <div className="relative z-10 border-t border-white/20 pt-6 mt-4 flex flex-wrap items-center justify-between gap-6 text-white/75 text-xs font-medium">
            <div className="flex items-center gap-2">
              <Wheat className="w-4 h-4 text-white" />
              <span className="tracking-widest uppercase font-semibold text-[11px]">ITC Agri</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-white" />
              <span className="tracking-widest uppercase font-semibold text-[11px]">Patanjali Foods</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="tracking-widest uppercase font-semibold text-[11px]">Adani Wilmar</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="tracking-widest uppercase font-semibold text-[11px]">NABARD Accredited</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-white" />
              <span className="tracking-widest uppercase font-semibold text-[11px]">AgriPact Core v1.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE PLATFORM WORKFLOW (Flowchart & Task Implementation) */}
      <section id="explore-flow" className="py-12 md:py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="badge-pill mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#1b3b22]" />
            <span>Architecture & Core Flow</span>
          </div>
          <h2 className="font-editorial text-3xl md:text-5xl font-normal text-[#15261b]">
            From Requirement to <span className="italic">Active Contract</span>
          </h2>
          <p className="text-sm md:text-base text-[#465b4c] max-w-xl mx-auto mt-2">
            The platform faithfully executes the 6-step core sequence: Registration, Requirement
            Posting, Farmer Discovery, Turn-Based Negotiation, Terms Freeze, and Contract Confirmation.
          </p>

          {/* Workflow Tabs */}
          <div className="inline-flex p-1.5 bg-white/80 border border-[#d6dfd7] rounded-full mt-6 shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2 text-xs md:text-sm rounded-full transition-all cursor-pointer font-medium ${
                activeTab === 'overview'
                  ? 'bg-[#1b3b22] text-white shadow'
                  : 'text-[#4a6150] hover:text-[#1b3b22]'
              }`}
            >
              System Flow
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-5 py-2 text-xs md:text-sm rounded-full transition-all cursor-pointer font-medium ${
                activeTab === 'marketplace'
                  ? 'bg-[#1b3b22] text-white shadow'
                  : 'text-[#4a6150] hover:text-[#1b3b22]'
              }`}
            >
              Buyer Requirements (Browse)
            </button>
            <button
              onClick={() => setActiveTab('negotiation')}
              className={`px-5 py-2 text-xs md:text-sm rounded-full transition-all cursor-pointer font-medium ${
                activeTab === 'negotiation'
                  ? 'bg-[#1b3b22] text-white shadow'
                  : 'text-[#4a6150] hover:text-[#1b3b22]'
              }`}
            >
              Live Negotiation & Contract
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & FLOW STEPS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#1b3b22]/10 text-[#1b3b22] flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#15261b] mb-2">
                Role-Based Entry
              </h3>
              <p className="text-sm text-[#4a6150] leading-relaxed mb-4">
                Farmers provide district and farm profile; institutional buyers register verified
                business credentials. Separate dashboards ensure personalized workflows.
              </p>
              <div className="bg-[#f7f8f5] rounded-xl p-3 text-xs text-[#2b4432] border border-[#e5ebe6]">
                <strong>Rule:</strong> Strict RBAC on all endpoints; only buyers post requirements,
                only farmers submit initial offers.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#1b3b22]/10 text-[#1b3b22] flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#15261b] mb-2">
                Append-Only Counter Offers
              </h3>
              <p className="text-sm text-[#4a6150] leading-relaxed mb-4">
                Price, quantity, and delivery date can be countered turn-by-turn. A party cannot counter
                their own proposal; negotiation history is strictly immutable.
              </p>
              <div className="bg-[#f7f8f5] rounded-xl p-3 text-xs text-[#2b4432] border border-[#e5ebe6]">
                <strong>Integrity:</strong> `NegotiationEntry` records cannot be updated or deleted.
                Turns alternate until one side accepts.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#1b3b22]/10 text-[#1b3b22] flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#15261b] mb-2">
                Dual-Confirm Contract Lock
              </h3>
              <p className="text-sm text-[#4a6150] leading-relaxed mb-4">
                Acceptance freezes terms and generates a unique Contract ID (e.g. AGP-2026-0042). Both
                farmer and buyer must confirm to activate and download the PDF.
              </p>
              <div className="bg-[#f7f8f5] rounded-xl p-3 text-xs text-[#2b4432] border border-[#e5ebe6]">
                <strong>Status:</strong> Pending Confirmation → Both Confirm → Active & Locked
                (Read-only terms).
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUYER REQUIREMENT LISTINGS (FARMER DISCOVERY) */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Filter bar */}
            <div className="bg-white rounded-2xl p-4 border border-[#e1e8e2] shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#56695b]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#56695b]">
                  Filter by Crop:
                </span>
                {['all', 'Wheat', 'Rice', 'Mustard', 'Soybean'].map((crop) => (
                  <button
                    key={crop}
                    onClick={() => setSelectedCrop(crop)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                      selectedCrop === crop
                        ? 'bg-[#1b3b22] text-white'
                        : 'bg-[#f0f4f0] text-[#344d3b] hover:bg-[#e4ede5]'
                    }`}
                  >
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </button>
                ))}
              </div>
              <div className="text-xs text-[#56695b] font-medium">
                Showing {filteredListings.length} verified pre-crop listings
              </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm hover:border-[#1b3b22]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#637d6a] bg-[#f2f7f3] px-2 py-0.5 rounded border border-[#dfe7e0]">
                          {item.id}
                        </span>
                        <h4 className="font-editorial text-2xl font-bold text-[#15261b] mt-1">
                          {item.crop}
                        </h4>
                        <p className="text-xs text-[#4a6150] flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5" /> {item.buyer}
                        </p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ₹{item.pricePerUnit.toLocaleString()} / {item.unit.slice(0, -1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 my-3 border-y border-[#edf2ee] text-xs">
                      <div>
                        <span className="text-[#6d8474] block">Required Quantity</span>
                        <span className="font-semibold text-[#15261b]">
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6d8474] block">Quality Spec</span>
                        <span className="font-semibold text-[#15261b]">
                          {item.qualityGrade} ({item.moistureMax})
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6d8474] block">Target Delivery</span>
                        <span className="font-semibold text-[#15261b] flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#1b3b22]" /> {item.deliveryDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#6d8474] block">Location</span>
                        <span className="font-semibold text-[#15261b] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#1b3b22]" /> {item.location}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#556e5c] italic bg-[#fbfdfb] p-2 rounded-lg border border-[#edf3ee] mb-4">
                      Payment Terms: {item.paymentTerms}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('negotiation')}
                      className="btn-forest-pill text-xs w-full py-2.5"
                    >
                      <Sprout className="w-3.5 h-3.5" />
                      <span>Submit Offer / Negotiate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE NEGOTIATION & CONTRACT CONFIRMATION */}
        {activeTab === 'negotiation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Negotiation Timeline */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#edf2ee]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#637d6a]">
                    Negotiation Thread #NEG-8820
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#15261b]">
                    Wheat (Sharbati) • 500 Quintals
                  </h3>
                </div>
                <div className="badge-pill bg-[#f0f6f1] text-[#1b3b22] text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turn-based Session</span>
                </div>
              </div>

              {/* Immutable Timeline */}
              <div className="space-y-4 mb-6">
                {/* Entry 1: Buyer original requirement */}
                <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e5ebe6]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-[#1b3b22] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> ITC Agri-Business (Buyer)
                    </span>
                    <span className="text-[#7d9483]">Listing Base Proposal</span>
                  </div>
                  <div className="text-sm font-medium text-[#15261b]">
                    Proposed: ₹3,250/Qtl for 500 Quintals • Delivery: 2026-04-15
                  </div>
                  <p className="text-xs text-[#526a57] mt-1">
                    "Looking for Grade A Sharbati Wheat with &lt;12% moisture at Sehore Mandi."
                  </p>
                </div>

                {/* Entry 2: Farmer Counter Offer */}
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-emerald-900 flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5" /> Ramesh Patel (Farmer)
                    </span>
                    <span className="text-emerald-700 font-mono text-[11px]">Counter #1</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-950">
                    Countered: ₹3,400/Qtl for 500 Quintals • Delivery: 2026-04-20
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    "Given high quality organic manure used, requesting ₹3,400 with 5 days harvesting buffer."
                  </p>
                </div>

                {/* Entry 3: Buyer Counter Offer */}
                {negotiationStep >= 2 && (
                  <div className="p-4 rounded-xl bg-[#f8faf8] border border-[#e5ebe6]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#1b3b22] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> ITC Agri-Business (Buyer)
                      </span>
                      <span className="text-[#7d9483] font-mono text-[11px]">Counter #2 (Latest)</span>
                    </div>
                    <div className="text-sm font-medium text-[#15261b]">
                      Countered: ₹3,350/Qtl for 500 Quintals • Total: ₹16,75,000
                    </div>
                    <p className="text-xs text-[#526a57] mt-1">
                      "We can meet at ₹3,350/Qtl with 2026-04-18 delivery date. Ready to sign pre-crop contract."
                    </p>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="p-4 bg-[#f4f7f4] rounded-xl border border-[#dfe7e0] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#3b5440]">
                  {negotiationStep === 2 ? (
                    <span>
                      Farmer's Turn: Only <strong>Ramesh Patel</strong> can accept or counter now.
                    </span>
                  ) : (
                    <span className="font-semibold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Agreed terms frozen into
                      Contract!
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {negotiationStep === 2 && (
                    <button
                      onClick={() => setNegotiationStep(3)}
                      className="btn-forest-pill text-xs py-2 px-4"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept Agreed Terms (₹3,350)</span>
                    </button>
                  )}
                  {negotiationStep === 3 && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Terms Accepted
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Generated Contract & Dual Confirmation */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#e1e8e2] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#edf2ee] mb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#6d8473] uppercase">Legal Document</span>
                  <h4 className="font-editorial text-2xl font-bold text-[#15261b]">
                    Contract AGP-2026-0042
                  </h4>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isContractActive
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}
                >
                  {isContractActive ? 'ACTIVE & LOCKED' : 'PENDING CONFIRMATION'}
                </span>
              </div>

              {/* Contract terms card */}
              <div className="space-y-2.5 text-xs text-[#2b4432] bg-[#f9faf8] p-4 rounded-xl border border-[#e5ece6] mb-5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#6d8474]">Commodity:</span>
                  <span className="font-semibold">Wheat (Sharbati) Grade A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d8474]">Agreed Quantity:</span>
                  <span className="font-semibold">500 Quintals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d8474]">Agreed Price:</span>
                  <span className="font-semibold">₹3,350 / Quintal</span>
                </div>
                <div className="flex justify-between border-t border-[#e2eae3] pt-2 text-sm font-sans font-bold text-[#1b3b22]">
                  <span>Total Value:</span>
                  <span>₹16,75,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d8474]">Delivery Schedule:</span>
                  <span>On or before April 18, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6d8474]">Delivery Hub:</span>
                  <span>Sehore Central Warehouse, MP</span>
                </div>
              </div>

              {/* Dual Party Confirmation status */}
              <div className="space-y-3 mb-6">
                <div className="text-xs font-semibold text-[#15261b] uppercase tracking-wider">
                  Dual-Party Confirmation Checklist:
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[#e0e8e1] bg-white">
                  <div className="flex items-center gap-2 text-xs">
                    <Sprout className="w-4 h-4 text-[#1b3b22]" />
                    <div>
                      <div className="font-semibold text-[#15261b]">Farmer (Ramesh Patel)</div>
                      <div className="text-[11px] text-[#6d8474]">
                        {contractConfirmed.farmer ? 'Digitally Signed & Timestamped' : 'Awaiting confirmation'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConfirm('farmer')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      contractConfirmed.farmer
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#edf2ee] text-[#1b3b22] hover:bg-[#dfe6e0]'
                    }`}
                  >
                    {contractConfirmed.farmer ? 'Confirmed ✓' : 'Confirm as Farmer'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[#e0e8e1] bg-white">
                  <div className="flex items-center gap-2 text-xs">
                    <Building2 className="w-4 h-4 text-[#1b3b22]" />
                    <div>
                      <div className="font-semibold text-[#15261b]">Buyer (ITC Agri-Business)</div>
                      <div className="text-[11px] text-[#6d8474]">
                        {contractConfirmed.buyer ? 'Digitally Signed & Timestamped' : 'Awaiting confirmation'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConfirm('buyer')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      contractConfirmed.buyer
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#edf2ee] text-[#1b3b22] hover:bg-[#dfe6e0]'
                    }`}
                  >
                    {contractConfirmed.buyer ? 'Confirmed ✓' : 'Confirm as Buyer'}
                  </button>
                </div>
              </div>

              {/* PDF Download Button */}
              <button
                disabled={!isContractActive}
                onClick={() =>
                  alert(
                    'Contract PDF generated! SHA-256 hash locked and verified per AgriPact specification.'
                  )
                }
                className={`w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  isContractActive
                    ? 'btn-forest-pill shadow-lg'
                    : 'bg-[#e4ede5] text-[#869b8c] cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>{isContractActive ? 'Download Signed PDF Contract' : 'Locked (Both Must Confirm)'}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-[#e2e8e3] bg-white/60 py-10 px-4 text-center text-xs text-[#56695b]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1b3b22] flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5 text-emerald-200" />
            </div>
            <span className="font-editorial text-lg font-bold text-[#15261b]">KisanSetu (AgriPact)</span>
          </div>
          <p>© 2026 KisanSetu Platform. Pre-Crop Contract Farming System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#1b3b22] cursor-pointer">Privacy</span>
            <span className="hover:text-[#1b3b22] cursor-pointer">Terms</span>
            <span className="hover:text-[#1b3b22] cursor-pointer">Legal Framework</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
