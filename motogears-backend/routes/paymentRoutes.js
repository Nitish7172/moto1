const express = require('express');
const router = express.Router();
const { 
  getMethods, 
  createMethod, 
  deleteMethod,
  createRazorpayOrder,
  verifyRazorpayPayment 
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getMethods);
router.post('/', protect, admin, createMethod);
router.delete('/:id', protect, admin, deleteMethod);

// New Razorpay Routes
router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;