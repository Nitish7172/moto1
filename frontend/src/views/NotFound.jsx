import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const nav = useNavigate()
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <p className="text-gray-400 mb-6">Page not found.</p>
        <button onClick={() => nav('/')} className="bg-orange-600 px-6 py-3 rounded-lg text-white font-bold">Go Home</button>
      </div>
    </div>
  )
}
