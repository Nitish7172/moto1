const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  provider: { type: String, required: true }, // Ensure this is 'provider'
  details: { type: String, required: true },
  isEnabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);