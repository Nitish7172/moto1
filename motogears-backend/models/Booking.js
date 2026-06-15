const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Link to a registered user
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  model: { type: String, required: true }, // The bike name
  date: { type: Date, required: true },
  hasLicense: { type: Boolean, default: false },
  status: { type: String, default: 'Pending' }, // Status: Pending, Confirmed, Completed
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);