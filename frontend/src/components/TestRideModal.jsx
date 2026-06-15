import React, { useState, useEffect } from 'react'
import { X, Phone, User, Calendar, Check, Bike } from 'lucide-react'
import { PRODUCTS } from '../data/products'
import { useAuth } from '../context/AuthContext' // 1. Import Auth Context

export default function TestRideModal({ isOpen, onClose }) {
  const { userInfo } = useAuth() // 2. Get logged-in user info

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    model: '',
    date: '',
    hasLicense: false
  })

  // 3. Auto-fill form if user is logged in
  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || ''
      }))
    }
  }, [userInfo])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.hasLicense) {
      alert('You must have a valid motorcycle license to book a test ride.')
      return
    }

    // 4. Send Data to Backend
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userInfo ? userInfo._id : null // Send User ID if available
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Request Sent! We will contact you at ${formData.phone} to confirm your slot.`);
        onClose();
        // Reset non-user fields
        setFormData(prev => ({ ...prev, model: '', date: '', hasLicense: false }));
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Failed to connect to the server. Make sure the backend is running.');
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 transition-opacity bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg p-8 border shadow-2xl bg-neutral-900 rounded-2xl border-neutral-800 animate-fadeIn">
        <button onClick={onClose} className="absolute p-2 text-gray-400 rounded-full top-4 right-4 bg-neutral-800 hover:bg-neutral-700 hover:text-white">
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-center w-12 h-12 mb-4 text-orange-500 rounded-full bg-orange-600/20">
            <Bike size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white">Book a Test Ride</h2>
          <p className="mt-1 text-gray-400">Experience the power firsthand. Fill out the details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Full Name</label>
            <div className="relative">
              <User className="absolute text-gray-500 left-3 top-3" size={18} />
              <input required type="text" placeholder="John Doe" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute text-gray-500 left-3 top-3" size={18} />
                <input required type="tel" placeholder="+91 98765..." className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute text-gray-500 left-3 top-3" size={18} />
                <input required type="date" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-orange-500 focus:outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
          </div>

           {/* Added Email Field - useful for backend contact info */}
           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <input required type="email" placeholder="john@example.com" className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Select Motorcycle</label>
            <select required className="w-full px-4 py-3 text-white border rounded-lg bg-neutral-800 border-neutral-700 focus:border-orange-500 focus:outline-none" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}>
              <option value="">Choose your ride...</option>
              {PRODUCTS.map(bike => <option key={bike.id} value={bike.name}>{bike.name} - {bike.category}</option>)}
            </select>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <div className="relative flex items-center">
              <input type="checkbox" id="license" className="w-5 h-5 transition-all border rounded appearance-none cursor-pointer peer border-neutral-600 bg-neutral-800 checked:border-orange-500 checked:bg-orange-600" checked={formData.hasLicense} onChange={e => setFormData({...formData, hasLicense: e.target.checked})} />
              <Check size={14} className="absolute text-white -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none top-1/2 left-1/2 peer-checked:opacity-100" />
            </div>
            <label htmlFor="license" className="text-sm text-gray-400 cursor-pointer select-none">I confirm that I hold a valid two-wheeler driving license and will carry it during the test ride.</label>
          </div>

          <button type="submit" className="flex items-center justify-center w-full gap-2 py-3 mt-6 font-bold text-white transition-colors bg-orange-600 hover:bg-orange-700 rounded-xl">Confirm Booking</button>
        </form>
      </div>
    </div>
  )
}