const express = require('express');
const { 
  getProducts, 
  getProductById, // 1. Added this controller import
  createProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Public Routes
router.get('/', getProducts);
router.get('/:id', getProductById); // 2. Added this route to handle card clicks!

// Protected Admin Routes
router.post('/', protect, admin, createProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;