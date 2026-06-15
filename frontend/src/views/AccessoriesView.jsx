import React from 'react'
import { ACCESSORIES } from '../data/accessories'
import { ShoppingCart } from 'lucide-react'
import formatPrice from '../utils/formatPrice'
import { useCart } from '../context/CartContext'

export default function AccessoriesView() {
  const { addToCart } = useCart()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-4xl font-black text-white mb-12 text-center">Pro Rider Gear</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {ACCESSORIES.map(item => (
          <div key={item.id} className="bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 hover:border-orange-500 transition-all group">
            <div className="h-56 overflow-hidden relative">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-black/70 px-3 py-1 rounded-full text-xs text-white font-bold">{item.category}</div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-500">{formatPrice(item.price)}</span>
                <button onClick={() => addToCart(item)} className="bg-white hover:bg-orange-500 text-neutral-900 hover:text-white p-2 rounded-lg transition-colors">
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
