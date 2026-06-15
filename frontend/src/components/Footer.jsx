import React from 'react'
import { Facebook, Twitter, Instagram, ArrowRight, Phone, Mail, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-8 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center transform -skew-x-12">
                <span className="font-bold text-lg skew-x-12">M</span>
              </div>
              <span className="font-bold text-xl">MOTO<span className="text-orange-500">GEARS</span></span>
            </div>
            <p className="text-gray-400 leading-relaxed">Premium motorcycles for the modern rider. We bring you the best engineering and design from around the world.</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Shop</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">All Bikes</button></li>
              <li><button onClick={() => navigate('/accessories')} className="hover:text-orange-500 transition-colors">Accessories</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">Parts</button></li>
              <li><button onClick={() => navigate('/accessories')} className="hover:text-orange-500 transition-colors">Gear</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><button onClick={() => navigate('/about')} className="hover:text-orange-500 transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-orange-500 transition-colors">Contact</button></li>
              <li><button onClick={() => navigate('/about')} className="hover:text-orange-500 transition-colors">Careers</button></li>
              <li><button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors">Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Join our newsletter for the latest drops and rides.</p>
            <div className="flex gap-2 mb-6">
              <input type="email" placeholder="Enter email" className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-orange-500 text-white" />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg">
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2025 MotoGears India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
