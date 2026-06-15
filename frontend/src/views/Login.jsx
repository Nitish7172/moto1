import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate(data.isAdmin ? '/admin' : '/');
      } else {
        alert(data.message);
      }
    } catch (err) { 
      alert('Failed to connect to server'); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-neutral-950">
      <form onSubmit={handleSubmit} className="p-8 border shadow-2xl bg-neutral-900 rounded-xl w-96 border-neutral-800">
        <h2 className="mb-6 text-3xl font-bold text-orange-500">Login</h2>
        
        <div className="mb-6 space-y-4">
          <input 
            className="w-full p-3 text-white border rounded outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          <input 
            className="w-full p-3 text-white border rounded outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <button className="w-full py-3 font-bold transition-colors bg-orange-600 rounded-lg hover:bg-orange-700">
          Login
        </button>

        {/* This is the part that was missing */}
        <p className="mt-6 text-sm text-center text-gray-400">
          New here? <Link to="/register" className="font-bold text-orange-500 transition-colors hover:text-white">Create an account</Link>
        </p>
      </form>
    </div>
  );
}