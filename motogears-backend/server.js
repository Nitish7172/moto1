const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// ✅ FIX: Load .env variables BEFORE importing any of your own files
dotenv.config(); 

const connectDB = require('./config/db');
const aiRoutes = require('./routes/aiRoutes'); // Now it has access to the API key

connectDB(); // Connect to Database

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/services', require('./routes/serviceRoutes')); 
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment-methods', require('./routes/paymentRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));