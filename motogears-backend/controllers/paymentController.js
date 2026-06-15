const PaymentMethod = require('../models/PaymentMethod');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// --- Existing Methods ---
const getMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find({});
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json(method);
  } catch (error) {
    res.status(400).json({ message: "Error adding payment method", error: error.message });
  }
};

const deleteMethod = async (req, res) => {
  try {
    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.json({ message: 'Method deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- NEW RAZORPAY METHODS ---

// @desc    Create a Razorpay Order
// @route   POST /api/payment-methods/razorpay/order
const createRazorpayOrder = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // Amount must be in paisa (smallest currency unit)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occurred");
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment-methods/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

module.exports = { 
  getMethods, 
  createMethod, 
  deleteMethod, 
  createRazorpayOrder, 
  verifyRazorpayPayment 
};