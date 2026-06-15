const express = require('express');
const router = express.Router();
const { createBooking, getBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', createBooking); // Allow anyone to book
router.get('/', protect, admin, getBookings); // Only admins can view list

module.exports = router;