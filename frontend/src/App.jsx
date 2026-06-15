import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import TestRideModal from './components/TestRideModal'

import HomeView from './views/HomeView'
import AccessoriesView from './views/AccessoriesView'
import ServiceView from './views/ServiceView'
import AboutView from './views/AboutView'
import NotFound from './views/NotFound'

import { useCart } from './context/CartContext'

import Login from './views/Login'
import AdminDashboard from './views/AdminDashboard'
import Register from './views/Register'
import CheckoutView from './views/CheckoutView' 
import ProductDetailView from './views/ProductDetailView' // <-- NEW IMPORT

export default function App() {
  const [isTestRideOpen, setIsTestRideOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const { cart } = useCart()

  return (
    <div className="min-h-screen text-gray-100 bg-neutral-950">

      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onBookTestRide={() => setIsTestRideOpen(true)}
        onSearchChange={setSearchText}
      />

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomeView
                onBookTestRide={() => setIsTestRideOpen(true)}
                searchText={searchText}
              />
            }
          />

          <Route path="/accessories" element={<AccessoriesView />} />
          <Route path="/service" element={<ServiceView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<CheckoutView />} /> 
          
          {/* <-- NEW ROUTE FOR CLICKABLE AI SUGGESTIONS --> */}
          <Route path="/product/:id" element={<ProductDetailView />} />
        </Routes>
      </main>

      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <TestRideModal isOpen={isTestRideOpen} onClose={() => setIsTestRideOpen(false)} />
    </div>
  )
}