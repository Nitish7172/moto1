import React, { useState, useEffect } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=1600&q=80",
    title: "RIDE YOUR LEGACY",
    subtitle: "Experience the thrill of the open road with our premium range of motorcycles."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80",
    title: "UNLEASH POWER",
    subtitle: "Dominate every turn with precision engineering and unmatched performance."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1614165936126-2ed18e471b10?auto=format&fit=crop&w=1600&q=80",
    title: "DEFY LIMITS",
    subtitle: "Pushing the boundaries of speed, style, and innovation for the modern rider."
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=80",
    title: "ADVENTURE AWAITS",
    subtitle: "Go where the map ends. Built for the wildest terrains on earth."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=1600&q=80",
    title: "PURE ADRENALINE",
    subtitle: "Feel the rush of pure speed with our track-ready sport bikes."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=80",
    title: "CLASSIC SOUL",
    subtitle: "Timeless design meets modern technology. Ride with style."
  }
]

export default function Hero({ onBookTestRide }) {
  const [current, setCurrent] = useState(0)

  // Auto-advance slide every 3 seconds
  // Added [current] dependency to reset timer on manual interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(timer)
  }, [current])

  const nextSlide = () => setCurrent(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1))
  const prevSlide = () => setCurrent(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))

  return (
    <div className="relative bg-neutral-900 h-[600px] flex items-center overflow-hidden group">
      
      {/* Background Images Carousel */}
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt="Hero Background" 
            // Changed opacity-40 to opacity-90 for high visibility
            className="object-cover w-full h-full opacity-90" 
          />
          {/* Adjusted gradient to be lighter in the middle (60) to account for brighter image */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 w-full px-6 mx-auto max-w-7xl">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block px-4 py-1 text-sm font-bold tracking-wider text-orange-500 uppercase border rounded-full bg-orange-600/20 border-orange-500/50 animate-fadeIn">
            New Collection 2025
          </div>

          <h1 className="text-5xl font-black leading-tight text-white transition-all duration-700 transform md:text-7xl drop-shadow-lg">
            {SLIDES[current].title.split(' ').slice(0, -1).join(' ')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              {SLIDES[current].title.split(' ').slice(-1)}
            </span>
          </h1>

          <p className="h-20 max-w-lg text-lg text-gray-200 transition-opacity duration-500 drop-shadow-md">
            {SLIDES[current].subtitle}
          </p>

          <div className="flex gap-4 pt-4">
            <a href="#shop-section" className="flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-colors bg-orange-600 rounded-lg shadow-lg hover:bg-orange-700">
              Shop Bikes <ArrowRight size={20} />
            </a>
            <button onClick={onBookTestRide} className="px-8 py-4 text-lg font-bold text-white transition-colors border-2 rounded-lg border-white/20 hover:border-white hover:bg-white/10 backdrop-blur-sm">
              Book Test Ride
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute z-20 flex gap-3 transform -translate-x-1/2 bottom-8 left-1/2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${
              idx === current ? 'bg-orange-500 w-8' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Manual Controls (Visible on Hover) */}
      <button 
        onClick={prevSlide}
        className="absolute p-2 text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 left-4 top-1/2 bg-black/30 hover:bg-orange-600 group-hover:opacity-100 backdrop-blur-sm"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute p-2 text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 right-4 top-1/2 bg-black/30 hover:bg-orange-600 group-hover:opacity-100 backdrop-blur-sm"
      >
        <ChevronRight size={32} />
      </button>

    </div>
  )
}