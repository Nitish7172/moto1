import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('motogears_cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('motogears_cart', JSON.stringify(cart))
    } catch (e) {
      // ignore
    }
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
  }

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => setCart([])

  const getSubtotal = () => cart.reduce((sum, it) => sum + (it.price || 0), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getSubtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
