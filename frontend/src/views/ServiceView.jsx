import React from 'react'
import { SERVICES } from '../data/services'
import { Calendar, Check } from 'lucide-react'

export default function ServiceView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-black text-white mb-6">Master Service Center</h2>
          <p className="text-gray-400 mb-8 text-lg">Premium diagnostics and certified mechanics.</p>

          <div className="space-y-4 mb-8">
            {SERVICES.map((s, idx) => (
              <div key={idx} className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-lg">{s.title}</h4>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
                <span className="font-bold text-orange-500">₹ {s.price}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Check className="text-green-500" size={16}/> Certified Mechanics</div>
            <div className="flex items-center gap-2"><Check className="text-green-500" size={16}/> Genuine Parts</div>
          </div>
        </div>

        <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Calendar className="text-orange-500"/> Book Appointment</h3>

          <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Appointment Request Sent!') }}>
            <input type="text" placeholder="Name" className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white w-full"/>
            <input type="tel" placeholder="Phone Number" className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white w-full"/>
            <input type="text" placeholder="Bike Model" className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white w-full"/>
            <textarea placeholder="Additional Notes" rows="3" className="bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white w-full"></textarea>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl">Confirm Booking</button>
          </form>
        </div>
      </div>
    </div>
  )
}
