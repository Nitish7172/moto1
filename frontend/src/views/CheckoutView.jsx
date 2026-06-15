import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import formatPrice from '../utils/formatPrice'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'

// Helper function to load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutView() {
  const { cart, getSubtotal, clearCart } = useCart()
  const { userInfo } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [availableMethods, setAvailableMethods] = useState([])

  useEffect(() => {
    if (!userInfo) navigate('/login');
    
    // Fetch manual/admin-seeded methods
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods`)
      .then(res => res.json())
      .then(data => {
        // Automatically inject an "Online / Card (Razorpay)" option if it isn't seeded
        const hasRazorpay = data.some(m => m.provider.toLowerCase().includes('razorpay'));
        if (!hasRazorpay) {
          data.unshift({ _id: 'rzp_online', provider: 'Pay Online (Razorpay)', details: 'Credit/Debit Card, UPI, NetBanking' });
        }
        setAvailableMethods(data);
      })
      .catch(err => console.error("Error fetching payment methods:", err));
  }, [userInfo, navigate])

  const maskDetails = (text) => {
    if (!text) return '';
    if (text.includes('@')) {
      const [user, handle] = text.split('@');
      if (user.length > 3) {
        return `${user.slice(0, 2)}******${user.slice(-2)}@${handle}`;
      }
      return text;
    }
    if (/\d/.test(text) && text.length > 10) {
      return `**** **** **** ${text.slice(-4)}`;
    }
    return text;
  };

  const handlePlaceOrder = async () => {
    if (!address) return alert("Please enter shipping address");
    if (!paymentMethod) return alert("Please select a payment method");

    const totalPrice = getSubtotal();
    const orderData = {
      orderItems: cart.map(item => ({
        name: item.name,
        price: item.price,
        image: item.image,
        // FIX: Only send product ID if it's a valid MongoDB _id from the database
        ...(item._id ? { product: item._id } : {})
      })),
      shippingAddress: address,
      paymentMethod,
      totalPrice
    };

    // --- RAZORPAY FLOW ---
    if (paymentMethod.toLowerCase().includes('razorpay')) {
      const res = await loadRazorpayScript();
      if (!res) return alert('Razorpay SDK failed to load. Check your connection.');

      // 1. Create order on our backend
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods/razorpay/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderJson = await orderResponse.json();

      // 2. Configure Razorpay options
      const options = {
        key: 'rzp_test_Ss7D8xrSVJD2Qa', // <-- IMPORTANT: Replace with your actual Razorpay Key ID
        amount: orderJson.amount,
        currency: orderJson.currency,
        name: 'MotoGears India',
        description: 'Order Payment',
        order_id: orderJson.id,
        handler: async function (response) {
          // 3. Verify Payment
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment-methods/razorpay/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
            body: JSON.stringify(response)
          });

          if (verifyRes.ok) {
            // 4. Save Final Order to DB after successful payment
            saveOrderToDB({ ...orderData, isPaid: true });
          } else {
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
          contact: '' // Optional if you collect it
        },
        theme: { color: '#f97316' }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } else {
      // --- COD / MANUAL FLOW ---
      saveOrderToDB(orderData);
    }
  }

  // Helper function to hit the orderController
  const saveOrderToDB = async (orderData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (res.ok) {
        alert("Order Placed Successfully!");
        clearCart();
        navigate('/'); 
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing order.");
    }
  }

  if (cart.length === 0) return <div className="pt-24 text-center text-white">Your cart is empty</div>

  return (
    <div className="min-h-screen px-4 pt-24 pb-12 text-white bg-neutral-950">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white">
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="mb-8 text-3xl font-black">Checkout</h1>

        <div className="grid gap-12 md:grid-cols-2">
          {/* LEFT COLUMN - FORM */}
          <div className="space-y-8">
            <div className="p-6 border bg-neutral-900 rounded-2xl border-neutral-800">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <MapPin className="text-orange-500"/> Shipping Details
              </h2>
              <textarea 
                className="w-full p-3 text-white border rounded-lg outline-none bg-neutral-800 border-neutral-700 focus:border-orange-500"
                rows="3"
                placeholder="Enter full address..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div className="p-6 border bg-neutral-900 rounded-2xl border-neutral-800">
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <CreditCard className="text-orange-500"/> Payment Method
              </h2>
              <div className="space-y-3">
                {availableMethods.length > 0 ? availableMethods.map(method => (
                  <label key={method._id} className="flex items-start gap-3 p-3 transition-colors border rounded-lg cursor-pointer border-neutral-700 hover:bg-neutral-800">
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method.provider}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 mt-1 accent-orange-500"
                    />
                    <div className="flex-1">
                      <span className="block font-bold text-white">{method.provider}</span>
                      <span className="block font-mono text-sm text-gray-400">
                        {maskDetails(method.details)}
                      </span>
                    </div>
                  </label>
                )) : (
                  <p className="italic text-gray-400">No payment methods available.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="p-6 border bg-neutral-900 rounded-2xl border-neutral-800 h-fit">
            <h2 className="mb-6 text-xl font-bold">Order Summary</h2>
            <div className="mb-6 space-y-4 overflow-y-auto max-h-60">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="font-bold">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 mb-6 text-xl font-bold border-t border-neutral-800">
              <span>Total</span>
              <span className="text-orange-500">{formatPrice(getSubtotal())}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full py-4 font-bold text-white transition-all bg-orange-600 rounded-xl hover:bg-orange-700"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}