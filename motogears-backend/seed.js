require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Service = require('./models/Service'); 
const PaymentMethod = require('./models/PaymentMethod');

// --- 1. PRODUCT DATA (BIKES + ACCESSORIES WITH DECOUPLED DESCRIPTIONS) ---
const products = [
  // --- MOTORCYCLES ---
  {
    "name": "Raven R1",
    "category": "Sport",
    "price": 1550000,
    "image": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "specs": "998cc | 200hp",
    "tag": "Best Seller",
    "description": "Track-focused supersport engineered for extreme high-speed performance, sharp cornering, and aggressive canyon riding on smooth asphalt."
  },
  {
    "name": "Thunderbolt 500",
    "category": "Cruiser",
    "price": 450000,
    "image": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    "rating": 4.7,
    "specs": "500cc | 47hp",
    "tag": "New",
    "description": "A light, accessible cruiser with relaxed ergonomics and steady low-end power, perfect for casual weekend road trips and open scenic highways."
  },
  {
    "name": "Apex Predator",
    "category": "Sport",
    "price": 1890000,
    "image": "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=80",
    "rating": 5.0,
    "specs": "1100cc | 215hp",
    "tag": null,
    "description": "An elite, ultra-high-performance hyper-sport bike designed for closed racing circuits, high-speed straightaways, and absolute track domination."
  },
  {
    "name": "Desert Storm",
    "category": "Adventure",
    "price": 1250000,
    "image": "https://images.unsplash.com/photo-1622653938568-3a8d3eb1b78d?auto=format&fit=crop&w=800&q=80",
    "rating": 4.8,
    "specs": "850cc | 95hp",
    "tag": "Trending",
    "description": "Rugged dual-sport machine built with heavy-duty spoked wheels and long-travel suspension to conquer deep desert sand, loose gravel, and muddy trails."
  },
  {
    "name": "Classic 350",
    "category": "Classic",
    "price": 220000,
    "image": "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=800&q=80",
    "rating": 4.6,
    "specs": "350cc | 28hp",
    "tag": null,
    "description": "Lightweight, highly nimble retro roadster with an upright seating position. Ideal for navigating daily city traffic commutes and tight urban streets."
  },
  {
    "name": "Night Rod",
    "category": "Cruiser",
    "price": 1600000,
    "image": "https://images.unsplash.com/photo-1614165936126-2ed18e471b10?auto=format&fit=crop&w=800&q=80",
    "rating": 4.9,
    "specs": "1250cc | 120hp",
    "tag": "Limited",
    "description": "Power-cruiser boasting an aggressive low-slung stance and massive torque, custom-tailored for straight-line highway acceleration and long-distance asphalt cruising."
  },
  {
    "name": "Nomad X",
    "category": "Adventure",
    "price": 950000,
    "image": "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80",
    "rating": 4.5,
    "specs": "700cc | 72hp",
    "tag": null,
    "description": "Agile, lightweight adventure tourer featuring high ground clearance, excellent for multi-day remote backcountry exploring, fire roads, and rocky mountain terrain."
  },
  {
    "name": "Bonneville T120",
    "category": "Classic",
    "price": 1100000,
    "image": "https://images.unsplash.com/photo-1595239370234-3352b6b84121?auto=format&fit=crop&w=800&q=80",
    "rating": 4.8,
    "specs": "1200cc | 79hp",
    "tag": "Classic",
    "description": "Timeless iconic classic with effortless torque delivery, perfectly balanced for comfortable metropolitan lane splitting, urban cruising, and smooth paved highways."
  },
  
  // --- GEAR ACCESSORIES WITH INTEGRATED DESCRIPTIONS ---
  {
    name: "Carbon Helmet",
    category: "Gear",
    price: 45000,
    image: "/images/carbon_helmet.jpg",
    rating: 4.9,
    specs: "Premium Carbon Fiber | DOT Certified",
    tag: "Premium",
    description: "Ultra-lightweight aerodynamic carbon fiber shell offering maximum high-speed impact protection. Essential safety gear for track racing and sport performance."
  },
  {
    name: "Leather Jacket",
    category: "Gear",
    price: 28000,
    image: "/images/leather_jackets.jpg",
    rating: 4.8,
    specs: "Genuine Leather | CE Level 2 Armor",
    tag: "Classic",
    description: "Heavy-duty abrasion-resistant premium leather jacket with internal impact armor pads. Timeless design suited for cruisers, heritage classic models, and open roads."
  },
  {
    name: "Racing Gloves",
    category: "Gear",
    price: 8500,
    image: "/images/rider_gloves.jpg",
    rating: 4.6,
    specs: "Knuckle Protection | Touchscreen Friendly",
    tag: null,
    description: "Reinforced gauntlet gloves with composite knuckle armor plates and high grip feel. Designed for aggressive control handling on high-speed sport lines."
  },
  {
    name: "Riding Boots",
    category: "Gear",
    price: 18000,
    image: "/images/riding_boots.jpg",
    rating: 4.7,
    specs: "Waterproof | High Ankle Support",
    tag: null,
    description: "Weather-sealed, durable technical boots equipped with rigid ankle bracing protection. Crafted to withstand multi-day adventure tours and loose off-road conditions."
  },
  {
    name: "Knee Guards",
    category: "Gear",
    price: 3200,
    image: "/images/knee_guard.jpg",
    rating: 4.4,
    specs: "Dual Axis Articulation | High Impact ABS",
    tag: null,
    description: "Ergonomic high-impact impact guards providing comprehensive patella shielding. Crucial protection armor overlay for off-road dirt trails and single track forest exploration."
  }
];

// --- 2. SERVICES DATA ---
const services = [
  {
    title: "General Service",
    price: 2500,
    desc: "Oil change, filter cleaning, chain lube, and general inspection."
  },
  {
    title: "Full Detailing",
    price: 4000,
    desc: "Deep cleaning, polish, ceramic coating, and scratch removal."
  },
  {
    title: "Engine Tune-up",
    price: 8000,
    desc: "Valve clearance, spark plug check, and ECU remapping."
  },
  {
    title: "Tyre Replacement",
    price: 1200,
    desc: "Labour charge only. Tyres sold separately."
  }
];

// --- 3. PAYMENT METHODS ---
const payments = [
  {
    provider: "UPI",
    details: "7667590158@ybl",
    qrCode: "",
    isEnabled: true
  },
  {
    provider: "Cash on Delivery",
    details: "Pay upon receiving your bike or gear",
    isEnabled: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to DB');

    // Clear existing data to avoid duplicates
    await Product.deleteMany({});
    console.log('🗑️  Cleared products');
    
    if (mongoose.models.Service) {
      await Service.deleteMany({});
      console.log('🗑️  Cleared services');
      await Service.insertMany(services);
      console.log('🛠️  Added services');
    }

    await PaymentMethod.deleteMany({});
    console.log('🗑️  Cleared payments');

    // Insert new data
    await Product.insertMany(products);
    console.log('🏍️  Added bikes and synced accessories with descriptions');

    await PaymentMethod.insertMany(payments);
    console.log('💳 Added payment methods');

    console.log('🎉 Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();