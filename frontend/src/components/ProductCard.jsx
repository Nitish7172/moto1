import React from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import formatPrice from '../utils/formatPrice'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  // 1. Create a specialized handler function to stop event bubbling
  const handleAddToCart = (e) => {
    e.stopPropagation(); // <-- This prevents the page from navigating away!
    addToCart(product);
  };

  return (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden group border border-neutral-700 hover:border-orange-500/40 transition-all flex flex-col">
      <div className="relative h-64 overflow-hidden">
        {product.tag && (
          <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.tag}
          </span>
        )}

        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="text-yellow-400" /> {product.rating}
        </div>

        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <p className="text-sm text-orange-500 font-bold uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="text-xl font-bold text-white">{product.name}</h3>

        <p className="text-gray-400 text-sm mb-4 font-mono border-l-2 border-neutral-600 pl-3">{product.specs}</p>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-neutral-700">
          <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>

          {/* 2. Pass the click event 'e' into the modified handler function */}
          <button
            onClick={(e) => handleAddToCart(e)}
            className="bg-white text-neutral-900 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
          >
            Add <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}