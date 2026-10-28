import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import BuyerDashboard from './pages/BuyerDashboard.jsx'
import './App.css'
import ListingsPage from './pages/ListingsPage.jsx'
import NewListingPage from './pages/NewListingPage.jsx'
import MyListingsPage from './pages/MyListingsPage.jsx'
import ContractsPage from './pages/ContractsPage.jsx'
import ContractDetailPage from './pages/ContractDetailPage.jsx'
import OffersPage from './pages/OffersPage.jsx'
import NegotiationPage from './pages/NegotiationPage.jsx'
import ListingOffersPage from './pages/ListingOffersPage.jsx'
import CropMarketplacePage from './pages/CropMarketplacePage.jsx'
import CreateCropListingPage from './pages/CreateCropListingPage.jsx'
import CropDetailPage from './pages/CropDetailPage.jsx'
import CropOrdersPage from './pages/CropOrdersPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Farmer Protected Dashboard */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Buyer Protected Dashboard */}
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Aliases and catch-all */}
            <Route path="/listings" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><ListingsPage /></ProtectedRoute>} />
            <Route path="/listings/:id" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><ListingsPage /></ProtectedRoute>} />
            <Route path="/buyer/listings/new" element={<ProtectedRoute allowedRoles={['buyer']}><NewListingPage /></ProtectedRoute>} />
            <Route path="/buyer/listings" element={<ProtectedRoute allowedRoles={['buyer']}><MyListingsPage /></ProtectedRoute>} />
            <Route path="/buyer/listings/:id/offers" element={<ProtectedRoute allowedRoles={['buyer']}><ListingOffersPage /></ProtectedRoute>} />
            <Route path="/crops" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><CropMarketplacePage /></ProtectedRoute>} />
            <Route path="/crops/:id" element={<ProtectedRoute allowedRoles={['buyer']}><CropDetailPage /></ProtectedRoute>} />
            <Route path="/farmer/crops/new" element={<ProtectedRoute allowedRoles={['farmer']}><CreateCropListingPage /></ProtectedRoute>} />
            <Route path="/farmer/crops" element={<ProtectedRoute allowedRoles={['farmer']}><CropOrdersPage /></ProtectedRoute>} />
            <Route path="/buyer/orders" element={<ProtectedRoute allowedRoles={['buyer']}><CropOrdersPage /></ProtectedRoute>} />
            <Route path="/contracts" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><ContractsPage /></ProtectedRoute>} />
            <Route path="/contracts/:id" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><ContractDetailPage /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><OffersPage /></ProtectedRoute>} />
            <Route path="/offers/:id" element={<ProtectedRoute allowedRoles={['farmer', 'buyer']}><NegotiationPage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  )
}
