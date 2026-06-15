const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    }
  ],
  shippingAddress: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Processing' } // Processing, Shipped, Delivered
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
