import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        navigate('/'); // Redirect to home after signup
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Registration Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-20 text-white bg-neutral-950">
      <form onSubmit={handleSubmit} className="p-8 border shadow-2xl bg-neutral-900 rounded-xl border-neutral-800 w-96">
        <h2 className="mb-6 text-3xl font-bold text-orange-500">Create Account</h2>
        
        <div className="space-y-4">
          <input 
            className="w-full p-3 border rounded outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required
          />
          <input 
            className="w-full p-3 border rounded outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input 
            className="w-full p-3 border rounded outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
        </div>

        <button className="w-full py-3 mt-6 font-bold transition-colors bg-orange-600 rounded-lg hover:bg-orange-700">
          Sign Up
        </button>
        
        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-orange-500 hover:text-white">Login</Link>
        </p>
      </form>
    </div>
  );
}