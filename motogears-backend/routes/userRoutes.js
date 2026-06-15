const express = require('express');
const { registerUser, loginUser, getUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getUsers);

module.exports = router;