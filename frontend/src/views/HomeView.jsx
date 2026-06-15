import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Loader, Sparkles } from 'lucide-react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import CATEGORIES from '../data/categories'
import formatPrice from '../utils/formatPrice' 
// 1. IMPORT THE NEW LOCATION SUGGESTER
import LocationSuggester from '../components/LocationSuggester'

export default function HomeView({ onBookTestRide, searchText }) {
  const navigate = useNavigate() // Initializes the router for clickable products

  const [activeCategory, setActiveCategory] = useState('All')
  const [products, setProducts] = useState([]) 
  const [loading, setLoading] = useState(true)

  // AI State Variables
  const [aiResults, setAiResults] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  // Fetch Products from Backend
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching products:", err)
        setLoading(false)
      })
  }, [])

  // Filtering Logic for Standard Grid
  let filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  if (searchText.trim() !== "") {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  // AI Image Upload Handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAiResults(null); 

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/visual-search`, {
        method: 'POST',
        body: formData 
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to connect to AI service");
      }
      
      setAiResults(data);
    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Error: ${error.message}. Please check your backend terminal for details.`);
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Hero onBookTestRide={onBookTestRide} />

      {/* --- AI VISUAL SEARCH SECTION --- */}
      <section className="px-4 py-12 mx-auto max-w-7xl">
        <div className="flex flex-col items-center p-8 text-center border bg-neutral-900 border-neutral-800 rounded-3xl">
          <h2 className="flex items-center gap-2 mb-2 text-3xl font-black text-white">
            <Sparkles className="text-orange-500" /> Find Gear with AI
          </h2>
          <p className="max-w-lg mb-8 text-sm text-gray-400">
            Saw a cool piece of gear on the street? Upload a photo and our Gemini AI will analyze the style and find similar matches in our store.
          </p>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-8 py-4 font-bold text-white transition-all bg-orange-600 shadow-lg rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-orange-600/20"
          >
            {isAnalyzing ? <Loader className="animate-spin" size={20} /> : <Camera size={20} />}
            {isAnalyzing ? 'Analyzing Image...' : 'Upload Photo'}
          </button>

          {/* AI Results Display */}
          {aiResults && (
            <div className="w-full pt-8 mt-10 text-left duration-500 border-t border-neutral-800 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-start gap-1 mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-bold tracking-widest text-orange-900 uppercase bg-orange-500 rounded-full">
                    AI Detected
                  </span>
                  <p className="text-lg font-bold text-white capitalize">
                    {aiResults.analysis.color} {aiResults.analysis.style} {aiResults.analysis.category}
                  </p>
                </div>
                
                {aiResults.matchStatus === 'category_only' && (
                  <p className="mt-2 text-sm text-orange-400">
                    We didn't find that exact style, but here are some excellent {aiResults.analysis.category} options!
                  </p>
                )}
                {aiResults.matchStatus === 'random_fallback' && (
                  <p className="mt-2 text-sm text-orange-400">
                    We don't carry {aiResults.analysis.category} right now, but check out our popular gear!
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                {aiResults.products && aiResults.products.length > 0 ? (
                  aiResults.products.map(product => (
                    <div 
                      key={product._id} 
                      // 2. RESTORED CLICKABILITY FOR AI RESULTS
                      onClick={() => navigate(`/product/${product._id || product.id}`)}
                      className="p-4 transition-colors border cursor-pointer bg-neutral-950 border-neutral-800 rounded-xl hover:border-orange-500 group"
                    >
                       <p className="text-sm font-bold text-white truncate transition-colors group-hover:text-orange-500">{product.name}</p>
                       <p className="mt-1 text-sm font-bold text-gray-300">{formatPrice(product.price)}</p>
                       <p className="mt-2 text-xs text-gray-500 capitalize">{product.category}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">No exact inventory matches found for this style right now.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. NEW: MOUNT THE GPS SUGGESTER HERE */}
      <section className="px-4 pb-12 mx-auto max-w-7xl">
        <LocationSuggester />
      </section>

      {/* --- STANDARD SHOP SECTION --- */}
      <section id="shop-section" className="px-4 py-8 mx-auto max-w-7xl">
        
        <div className="flex flex-col justify-between gap-6 mb-12 md:flex-row">
          <div>
            <h2 className="mb-2 text-3xl font-black text-white">Full Inventory</h2>
            <p className="text-gray-400">Browse manually or use the category filters.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-white text-black shadow-lg'
                    : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {loading ? (
          <div className="py-20 text-center text-white">Loading inventory...</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.length > 0 ? (
              filtered.map(p => (
                // 4. RESTORED CLICKABILITY FOR STANDARD GRID
                <div key={p._id || p.id} onClick={() => navigate(`/product/${p._id || p.id}`)} className="cursor-pointer">
                  <ProductCard product={p} />
                </div>
              ))
            ) : (
              <div className="py-20 text-center col-span-full">
                <h3 className="mb-2 text-xl font-bold text-white">No items found</h3>
                <p className="text-gray-500">Try checking your connection or search term.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}
