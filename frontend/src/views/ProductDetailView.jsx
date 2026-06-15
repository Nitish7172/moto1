import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import formatPrice from '../utils/formatPrice';

export default function ProductDetailView() {
  const { id } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the specific product from the database
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-orange-500">
        <div className="w-12 h-12 border-b-2 border-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <h2 className="mb-4 text-2xl font-bold">{error || "Product not found"}</h2>
        <button onClick={() => navigate('/')} className="text-orange-500 hover:underline">
          Return to Garage
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 mb-8 text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft size={20} /> Back to browsing
      </button>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Left Column: Image */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex items-center justify-center h-[500px]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-contain max-h-full drop-shadow-2xl"
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <span className="px-3 py-1 text-sm font-bold tracking-wider text-orange-500 uppercase rounded-full bg-orange-500/10">
              {product.category}
            </span>
            {product.tag && (
              <span className="px-3 py-1 ml-3 text-sm font-bold tracking-wider text-gray-300 uppercase rounded-full bg-neutral-800">
                {product.tag}
              </span>
            )}
          </div>
          
          <h1 className="mb-4 text-4xl font-black leading-tight text-white md:text-5xl">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-orange-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.rating || 5.0} Reviews)</span>
          </div>

          <p className="mb-8 text-3xl font-bold text-white">
            {formatPrice(product.price)}
          </p>

          {/* Quick Specs / Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 border bg-neutral-900 rounded-xl border-neutral-800">
              <Zap className="text-orange-500" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Key Spec</p>
                <p className="text-sm font-bold text-white">{product.specs || "Standard"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border bg-neutral-900 rounded-xl border-neutral-800">
              <Shield className="text-orange-500" size={24} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Warranty</p>
                <p className="text-sm font-bold text-white">1 Year Official</p>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={() => addToCart(product)}
            className="flex items-center justify-center w-full gap-3 py-4 font-bold text-white transition-all bg-orange-600 shadow-lg hover:bg-orange-700 rounded-xl shadow-orange-600/20"
          >
            <ShoppingCart size={20} /> Add to Cart
          </button>

          <p className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Truck size={16} /> Free shipping on orders over ₹5,000
          </p>
        </div>
      </div>
    </div>
  );
}