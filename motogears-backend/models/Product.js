const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  specs: String,
  tag: String,
  rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);