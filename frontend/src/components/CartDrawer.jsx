import React, { useState, useEffect } from 'react'
import { X, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import formatPrice from '../utils/formatPrice'

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, getSubtotal, clearCart } = useCart()
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  // --- NEW: AI State Variables ---
  const [suggestedBundle, setSuggestedBundle] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)

  const total = getSubtotal()

  // --- NEW: Trigger Gemini when the cart opens and has items ---
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      // Use the first item in the cart as the main product for the bundle
      fetchAIBundles(cart[0].id || cart[0]._id);
    }
  }, [isOpen, cart]);

  const fetchAIBundles = async (productId) => {
    if (!productId) return;
    
    setLoadingAI(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/generate-bundle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mainProductId: productId })
      });
      const data = await response.json();
      setSuggestedBundle(data);
    } catch (error) {
      console.error("Failed to fetch AI bundle:", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCheckout = () => {
    if (!userInfo) {
      alert("You must be logged in to checkout.")
      navigate('/login')
      onClose()
    } else {
      onClose() 
      navigate('/checkout')
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-neutral-900 border-l border-neutral-800 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <ShoppingCart className="text-orange-500" /> Your Garage
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 rounded-full hover:bg-neutral-800 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* CART ITEMS */}
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full pt-10 space-y-4 text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-neutral-800 text-neutral-600">
                  <ShoppingCart size={40} />
                </div>
                <p className="text-lg text-gray-400">Your garage is empty.</p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-4 p-4 border bg-neutral-800/50 rounded-xl border-neutral-800">
                  <img src={item.image} alt={item.name} className="object-cover w-20 h-20 rounded-lg bg-neutral-700" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <p className="text-sm text-gray-400">{item.category || 'Accessory'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-orange-500">{formatPrice(item.price)}</span>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1 text-gray-500 transition-colors hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* --- NEW GEMINI AI SECTION --- */}
          {cart.length > 0 && (
            <div className="pt-6 mt-8 border-t border-neutral-800">
              <h3 className="flex items-center gap-2 mb-4 font-bold text-orange-500">
                <Sparkles size={18} /> AI Smart Suggestions
              </h3>
              
              {loadingAI ? (
                <p className="text-sm text-gray-400 animate-pulse">Gemini is analyzing your cart...</p>
              ) : suggestedBundle && suggestedBundle.items && suggestedBundle.items.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">{suggestedBundle.bundleTitle}</p>
                  {suggestedBundle.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      // ✅ UPDATED: Added onClick to close drawer and navigate
                      onClick={() => {
                        onClose();
                        navigate(`/product/${item._id || item.id}`);
                      }}
                      // ✅ UPDATED: Added cursor-pointer and hover styling
                      className="flex items-center justify-between p-3 text-sm transition-colors border rounded-lg cursor-pointer bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:border-orange-500"
                    >
                      <span className="pr-2 text-gray-200 truncate">{item.name}</span>
                      <span className="font-bold text-white whitespace-nowrap">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No suggestions available right now.</p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-neutral-800 bg-neutral-900">
          <div className="flex items-center justify-between mb-4 text-lg">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-xl font-bold text-white">{formatPrice(total)}</span>
          </div>
          <div className="flex gap-2">
            <button
              disabled={cart.length === 0}
              className="flex items-center justify-center flex-1 gap-2 py-3 font-bold text-white transition-all bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-700 disabled:cursor-not-allowed rounded-xl"
              onClick={handleCheckout} 
            >
              Checkout Now <ArrowRight size={20} />
            </button>
            <button
              onClick={() => clearCart()}
              className="px-4 py-3 text-white transition-all bg-neutral-800 rounded-xl hover:bg-neutral-700"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </>
  )
}