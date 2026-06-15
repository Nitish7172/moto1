import React, { useState } from 'react';
import { MapPin, Loader, Navigation, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';

export default function LocationSuggester() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null); 
  
  // New input state for manual natural language terrain descriptions
  const [locationText, setLocationText] = useState('');
  
  const navigate = useNavigate();

  // Quick select pill options to assist user interaction inspiration
  const terrainPresets = [
    "Rainy city street commuting in Seattle",
    "Rocky mountain trails in Colorado",
    "Twisty canyons in Southern California",
    "Stop-and-go highway traffic in Tokyo"
  ];

  const handleGetSuggestions = async (e, customText = null) => {
    if (e) e.preventDefault();
    
    const finalSearchText = customText || locationText;
    
    if (!finalSearchText.trim()) {
      setErrorMsg("Please type a location or pick a terrain preset first.");
      return;
    }

    setLoading(true);
    setErrorMsg(null); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/location-suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationText: finalSearchText.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze location conditions.");
      }

      setSuggestions(data);
    } catch (error) {
      console.error("Failed to fetch local suggestions:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset) => {
    setLocationText(preset);
    handleGetSuggestions(null, preset);
  };

  return (
    <div className="w-full max-w-4xl p-8 mx-auto transition-all duration-300 border bg-neutral-900 border-neutral-800 rounded-3xl">
      <div className="flex flex-col items-center text-center">
        <h2 className="flex items-center gap-2 mb-2 text-3xl font-black text-white">
          <Navigation className="text-orange-500" /> Terrain Consultant
        </h2>
        <p className="max-w-lg mb-8 text-sm text-gray-400">
          Type your location, regional terrain, or a custom target environment to discover the ultimate matching motorcycle recommendation package.
        </p>
      </div>

      {errorMsg && (
        <div className="max-w-lg p-4 mx-auto mb-6 text-sm text-red-400 border border-red-900 rounded-xl bg-red-950/30">
          ⚠️ {errorMsg}
        </div>
      )}

      {!suggestions ? (
        <div className="w-full max-w-2xl mx-auto">
          {/* User Text Search Input Submission Box */}
          <form onSubmit={handleGetSuggestions} className="flex flex-col w-full gap-3 mb-6 sm:flex-row">
            <input 
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              disabled={loading}
              placeholder="e.g., Highway lanesplitting in New York, dusty desert sand dunes..."
              className="flex-1 px-5 py-4 text-sm text-white transition-colors border rounded-xl bg-neutral-950 border-neutral-800 focus:outline-none focus:border-orange-500 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-4 font-bold text-white transition-all bg-orange-600 shadow-lg rounded-xl hover:bg-orange-700 disabled:opacity-50 shadow-orange-600/20 whitespace-nowrap"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? "Analyzing Environment..." : "Find Best Bikes"}
            </button>
          </form>

          {/* Inspiration Selection Presets Container */}
          <div className="text-center sm:text-left">
            <p className="mb-3 text-xs font-semibold tracking-wider uppercase text-neutral-500">Popular Environments</p>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {terrainPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-400 bg-neutral-950 border border-neutral-800 rounded-lg hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-50 transition-all"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results View Window Display Block */
        <div className="w-full pt-4 text-left duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col justify-between gap-4 pb-4 mb-4 border-b sm:flex-row sm:items-center border-neutral-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-black tracking-wide uppercase bg-orange-500 rounded-full text-orange-950">
                📍 {suggestions.location}
              </span>
            </div>
            <button 
              onClick={() => { setSuggestions(null); setLocationText(''); }}
              className="self-start text-xs font-bold transition-colors text-neutral-500 hover:text-white sm:self-center"
            >
              Reset Target Environment
            </button>
          </div>
          
          <p className="py-3 pl-4 pr-3 mb-8 text-sm italic leading-relaxed border-l-2 border-orange-500 text-neutral-300 bg-neutral-950/40 rounded-r-xl">
            "{suggestions.aiReasoning}"
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {suggestions.products && suggestions.products.length > 0 ? (
              suggestions.products.map(product => (
                <div 
                  key={product._id || product.id} 
                  onClick={() => navigate(`/product/${product._id || product.id}`)}
                  className="flex flex-col justify-between p-5 transition-all border cursor-pointer bg-neutral-950 border-neutral-800 rounded-2xl hover:border-orange-500 hover:shadow-xl hover:shadow-orange-600/[0.02] group"
                >
                  <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">
                      {product.category || "Motorcycle"}
                    </span>
                    <p className="text-base font-bold text-white truncate transition-colors group-hover:text-orange-500">
                      {product.name}
                    </p>
                    {product.specs && (
                      <p className="mt-2 text-xs text-neutral-500 line-clamp-2">
                        {product.specs}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-neutral-900">
                    <p className="text-base font-black text-neutral-200">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-xs font-semibold text-orange-500 transition-opacity opacity-0 group-hover:opacity-100">
                      View Details →
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-neutral-800 rounded-2xl col-span-full">
                <p className="text-sm text-neutral-500">
                  Gemini analyzed your target terrain profile cleanly, but no live matches are indexed in inventory right now.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}