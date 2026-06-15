const Booking = require('../models/Booking');

// @desc    Create a new test ride booking
// @route   POST /api/bookings
// @access  Public (or Protected if you require login)
const createBooking = async (req, res) => {
  try {
    const { name, email, phone, model, date, hasLicense, userId } = req.body;

    const booking = await Booking.create({
      user: userId || null, // Stores user ID if logged in
      name,
      email,
      phone,
      model,
      date,
      hasLicense
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error: error.message });
  }
};

// @desc    Get all bookings (For Admin Dashboard)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createBooking, getBookings };
