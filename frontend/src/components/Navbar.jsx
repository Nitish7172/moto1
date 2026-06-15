import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext' // Import AuthContext

export default function Navbar({ onOpenCart, onBookTestRide, onSearchChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)
  
  const { cart } = useCart()
  const { userInfo, logout } = useAuth() // Get user info and logout function
  const navigate = useNavigate()

  // Close search when clicking outside
  useEffect(() => {
    const close = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  // Handle Logout
  const handleLogout = () => {
    logout()
    navigate('/') // Redirect to home
    setIsMenuOpen(false) // Close mobile menu if open
  }

  return (
    <nav className="sticky top-0 z-50 text-white border-b bg-neutral-900 border-neutral-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="flex items-center justify-center w-10 h-10 transform -skew-x-12 bg-orange-600 rounded-lg">
              <span className="text-xl font-bold skew-x-12">M</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              MOTO<span className="text-orange-500">GEARS</span>
            </span>
          </Link>

          {/* NAV LINKS (Desktop) */}
          <div className="items-center hidden space-x-8 md:flex">
            <Link to="/" className="font-medium transition-colors hover:text-orange-500">Bikes</Link>
            <Link to="/accessories" className="font-medium transition-colors hover:text-orange-500">Accessories</Link>
            <Link to="/service" className="font-medium transition-colors hover:text-orange-500">Service</Link>
            <Link to="/about" className="font-medium transition-colors hover:text-orange-500">About</Link>
            
            {/* CONDITIONAL ADMIN LINK */}
            {userInfo?.isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 font-medium text-orange-500 transition-colors hover:text-white">
                 <LayoutDashboard size={16}/> Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-4">

            {/* SEARCH BAR */}
            <div ref={searchRef} className="relative hidden sm:block">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-neutral-800"
              >
                <Search size={20} />
              </button>

              {showSearch && (
                <div className="absolute right-0 w-64 p-3 mt-2 border shadow-xl bg-neutral-800 border-neutral-700 rounded-xl">
                  <input
                    type="text"
                    placeholder="Search bikes..."
                    className="w-full px-4 py-2 text-white border rounded-lg outline-none bg-neutral-900 border-neutral-600 focus:border-orange-500"
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* CART BUTTON */}
            <button onClick={onOpenCart} className="relative p-2 rounded-full hover:bg-neutral-800">
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold bg-orange-600 border-2 rounded-full border-neutral-900">
                  {cart.length}
                </span>
              )}
            </button>

            {/* LOGIN / PROFILE / LOGOUT (Desktop) */}
            <div className="items-center hidden gap-4 pl-4 border-l md:flex border-neutral-800">
              {userInfo ? (
                <>
                  <span className="text-sm font-bold text-gray-300">Hi, {userInfo.name.split(' ')[0]}</span>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-red-500 rounded-full hover:bg-neutral-800" 
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link to="/login" className="p-2 rounded-full hover:bg-neutral-800" title="Login">
                  <User size={20} />
                </Link>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full md:hidden hover:bg-neutral-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="p-4 space-y-4 border-t md:hidden bg-neutral-900 border-neutral-800">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg">Bikes</Link>
          <Link to="/accessories" onClick={() => setIsMenuOpen(false)} className="block text-lg">Accessories</Link>
          <Link to="/service" onClick={() => setIsMenuOpen(false)} className="block text-lg">Service</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg">About</Link>
          
          {/* Mobile Admin Link */}
          {userInfo?.isAdmin && (
             <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-lg font-bold text-orange-500">
               Admin Panel
             </Link>
          )}

          {/* Mobile Auth Section */}
          <div className="pt-4 mt-4 border-t border-neutral-800">
            {userInfo ? (
              <div className="space-y-3">
                <div className="text-gray-400">Signed in as <span className="font-bold text-white">{userInfo.name}</span></div>
                <button onClick={handleLogout} className="flex items-center w-full gap-2 font-bold text-red-500">
                   <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-bold">
                 <User size={18} /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}