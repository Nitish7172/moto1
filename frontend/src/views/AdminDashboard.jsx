import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, LayoutDashboard, Users, CreditCard, Package } from 'lucide-react';

export default function AdminDashboard() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('inventory');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Sport', price: '', image: '', specs: '' });
  const [newPayment, setNewPayment] = useState({ provider: '', details: '' });

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [userInfo, navigate, activeTab]);

  const fetchData = async () => {
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    try {
      if (activeTab === 'inventory') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
        setProducts(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, config);
        setUsers(await res.json());
      } else if (activeTab === 'payments') {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods`);
        setPayments(await res.json());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // --- HANDLERS ---

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      body: JSON.stringify(newProduct)
    });
    setNewProduct({ name: '', category: 'Sport', price: '', image: '', specs: '' });
    fetchData();
  };

  const handleDeleteProduct = async (id) => {
    if(!confirm("Delete this product?")) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    fetchData();
  };

  // ✅ UPDATED: Added robust error handling here
  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify(newPayment)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Payment Method Added!");
        setNewPayment({ provider: '', details: '' });
        fetchData(); // Refresh list
      } else {
        alert(`Failed: ${data.message || 'Check backend logs'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleDeletePayment = async (id) => {
    if(!confirm("Delete this payment method?")) return;
    await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });
    fetchData();
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-12 text-white bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-black">
            <LayoutDashboard className="text-orange-500" /> Admin Dashboard
          </h1>
          <button onClick={() => { logout(); navigate('/'); }} className="px-6 py-2 font-bold transition-colors bg-red-600 rounded-lg hover:bg-red-700">
            Logout
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 pb-4 mb-8 border-b border-neutral-800">
          <button onClick={() => setActiveTab('inventory')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'inventory' ? 'bg-orange-600 text-white' : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800'}`}>
            <Package size={20}/> Inventory
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'users' ? 'bg-orange-600 text-white' : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800'}`}>
            <Users size={20}/> Users
          </button>
          <button onClick={() => setActiveTab('payments')} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${activeTab === 'payments' ? 'bg-orange-600 text-white' : 'bg-neutral-900 text-gray-400 hover:bg-neutral-800'}`}>
            <CreditCard size={20}/> Payments
          </button>
        </div>

        {/* === INVENTORY TAB === */}
        {activeTab === 'inventory' && (
          <div className="animate-fadeIn">
            {/* Add Product Form */}
            <div className="p-6 mb-8 border bg-neutral-900 rounded-2xl border-neutral-800">
              <h2 className="mb-4 text-xl font-bold text-orange-500">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid gap-4 md:grid-cols-2">
                <input placeholder="Product Name" className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} required />
                <input placeholder="Price (₹)" type="number" className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} required />
                <input placeholder="Image URL" className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} required />
                <input placeholder="Specs (e.g. 1000cc | 200hp)" className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" value={newProduct.specs} onChange={e=>setNewProduct({...newProduct, specs: e.target.value})} />
                
                <div className="md:col-span-2">
                  <button type="submit" className="flex items-center justify-center w-full gap-2 p-3 font-bold bg-green-600 rounded-lg hover:bg-green-700">
                    <Plus size={20}/> Add Product
                  </button>
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="grid gap-4">
              {products.map(p => (
                <div key={p._id} className="flex items-center justify-between p-4 border bg-neutral-900 rounded-xl border-neutral-800">
                  <div className="flex items-center gap-4">
                    <img src={p.image} className="object-cover w-16 h-16 rounded-lg" alt="" />
                    <div>
                      <h4 className="text-lg font-bold">{p.name}</h4>
                      <p className="text-sm text-gray-400">₹{p.price}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-500 transition-colors rounded-full hover:bg-neutral-800">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === USERS TAB === */}
        {activeTab === 'users' && (
          <div className="grid gap-4 animate-fadeIn">
            {users.map(u => (
              <div key={u._id} className="flex items-center justify-between p-6 border bg-neutral-900 rounded-xl border-neutral-800">
                <div>
                  <h4 className="text-lg font-bold">{u.name}</h4>
                  <p className="text-gray-400">{u.email}</p>
                </div>
                {u.isAdmin ? (
                  <span className="px-3 py-1 text-sm font-bold text-orange-500 border rounded-full bg-orange-600/20 border-orange-500/50">Admin</span>
                ) : (
                  <span className="px-3 py-1 text-sm font-bold text-gray-400 rounded-full bg-neutral-800">User</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* === PAYMENTS TAB === */}
        {activeTab === 'payments' && (
          <div className="animate-fadeIn">
            {/* Add Payment Form */}
            <div className="p-6 mb-8 border bg-neutral-900 rounded-2xl border-neutral-800">
              <h2 className="mb-4 text-xl font-bold text-orange-500">Add Payment Method</h2>
              <form onSubmit={handleAddPayment} className="grid gap-4 md:grid-cols-2">
                <input 
                  placeholder="Provider Name (e.g. UPI, Bank Transfer)" 
                  className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
                  value={newPayment.provider} 
                  onChange={e=>setNewPayment({...newPayment, provider: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Details (e.g. pay@okaxis, Acc No: 12345)" 
                  className="p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500" 
                  value={newPayment.details} 
                  onChange={e=>setNewPayment({...newPayment, details: e.target.value})} 
                  required 
                />
                <div className="md:col-span-2">
                  <button type="submit" className="flex items-center justify-center w-full gap-2 p-3 font-bold bg-green-600 rounded-lg hover:bg-green-700">
                    <Plus size={20}/> Add Payment Method
                  </button>
                </div>
              </form>
            </div>

            {/* Payment List */}
            <div className="grid gap-4">
              {payments.length === 0 ? (
                <p className="py-8 text-center text-gray-500">No payment methods added yet.</p>
              ) : (
                payments.map(method => (
                  <div key={method._id} className="flex items-center justify-between p-6 border bg-neutral-900 rounded-xl border-neutral-800">
                    <div>
                      <h4 className="text-lg font-bold text-white">{method.provider}</h4>
                      <p className="mt-1 font-mono text-sm text-gray-400">{method.details}</p>
                    </div>
                    <button onClick={() => handleDeletePayment(method._id)} className="p-2 text-red-500 transition-colors rounded-full hover:bg-neutral-800">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}