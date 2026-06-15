const express = require('express');
const router = express.Router();
const multer = require('multer');

// Imports the safely decoupled upgraded controller tracking modules
const { 
  visualSearch, 
  generateBundle, 
  locationSuggestions 
} = require('../controllers/aiController');

// Configure Multer allocation footprint cleanly inside transient system memory
const upload = multer({ storage: multer.memoryStorage() });

// Mount your exposed application endpoints
router.post('/visual-search', upload.single('image'), visualSearch);
router.post('/generate-bundle', generateBundle);
router.post('/location-suggestions', locationSuggestions);

module.exports = router;