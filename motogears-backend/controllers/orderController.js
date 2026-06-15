const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
  try {
    // Add isPaid to the destructured body
    const { orderItems, shippingAddress, paymentMethod, totalPrice, isPaid } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id, 
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: isPaid || false // Capture the payment status
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders };