import React from 'react'
import Navbar from './Navbar.jsx'
import { Sprout } from 'lucide-react'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#15261b] selection:bg-[#1b3b22] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 max-w-6xl mx-auto w-full">
        {children}
      </main>

      <footer className="border-t border-[#e2e8e3] bg-white/70 py-10 px-4 text-center text-xs text-[#56695b] mt-auto">
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
