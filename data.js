// Late Night Delivery - Product Data 

const LND_CATALOG = [
  {
    id: "prod-101",
    name: "Midnight Double Cheeseburger",
    category: "food",
    price: 320,
    originalPrice: 420,
    discountPercent: 24,
    rating: 4.9,
    prepTime: "15-20 min",
    description: "Two crispy beef patties with double cheddar, caramelized onions, pickles and special sauce in a brioche bun.",
    image:"images/burger.jpg",
    addOns: [
      { id: "a1", name: "Extra Cheese", price: 40 },
      { id: "a2", name: "Crispy Bacon", price: 60 },
      { id: "a3", name: "Truffle Fries (Side)", price: 90 }
    ]
  },
  {
    id: "prod-102",
    name: "Chicken Shawarma Wrap",
    category: "food",
    price: 230,
    originalPrice: 290,
    discountPercent: 21,
    rating: 4.8,
    prepTime: "12-18 min",
    description: "Grilled spiced chicken in fresh pita bread with garlic sauce, pickles and fresh potatoes.",
    image: "images/shawrma.jpg",
    addOns: [
      { id: "a4", name: "Extra Garlic Sauce", price: 25 },
      { id: "a5", name: "Spicy Pickles", price: 20 },
      { id: "a6", name: "Cold Drink Can", price: 40 }
    ]
  },
  {
    id: "prod-103",
    name: "Buffalo Wings (12 Pcs)",
    category: "food",
    price: 350,
    originalPrice: 480,
    discountPercent: 27,
    rating: 4.7,
    prepTime: "15-20 min",
    description: "Crispy fried chicken wings in spicy buffalo sauce with ranch dip and celery sticks.",
    image: "images/chicken.jpg",
    addOns: [
      { id: "a7", name: "Extra Ranch Dip", price: 25 },
      { id: "a8", name: "Potato Wedges", price: 70 }
    ]
  },
  {
    id: "prod-104",
    name: "Pepperoni Pizza (12 inch)",
    category: "food",
    price: 480,
    originalPrice: 600,
    discountPercent: 20,
    rating: 4.9,
    prepTime: "25-30 min",
    description: "Hand-tossed pizza with mozzarella, tomato sauce, and pepperoni topped with Italian herbs.",
    image: "images/pizza.jpg",
    addOns: [
      { id: "a9", name: "Garlic Dip", price: 25 },
      { id: "a10", name: "Extra Cheese", price: 70 }
    ]
  },
  {
    id: "prod-105",
    name: "Chocolate Lava Cake",
    category: "food",
    price: 180,
    originalPrice: 240,
    discountPercent: 25,
    rating: 4.9,
    prepTime: "10-15 min",
    description: "Warm dark chocolate cake with molten center, served with a scoop of vanilla ice cream.",
    image: "images/dark cake.jpg",
    addOns: [
      { id: "a11", name: "Extra Ice Cream", price: 50 },
      { id: "a12", name: "Berry Sauce", price: 35 }
    ]
  },
  {
    id: "prod-106",
    name: "Student Study Bundle",
    category: "grocery",
    price: 390,
    originalPrice: 520,
    discountPercent: 25,
    rating: 4.8,
    prepTime: "10-15 min",
    description: "2x Energy drink, 1x Noodle cup, 1x Chips pack, 1x Chocolate bar. Perfect for exam nights.",
    image: "images/drink.jpg",
    addOns: [
      { id: "a13", name: "Extra Energy Drink", price: 80 },
      { id: "a14", name: "Instant Coffee Can", price: 90 }
    ]
  },
  {
    id: "prod-107",
    name: "Emergency Medicine Pack",
    category: "medicine",
    price: 280,
    originalPrice: 350,
    discountPercent: 20,
    rating: 4.9,
    prepTime: "10-15 min",
    description: "Paracetamol (10 tabs), Antacid (4 tabs), ORS sachets (2 packs), Band-Aids. Night relief kit.",
    image: "images/tablet.jpg",
    addOns: [
      { id: "a15", name: "Vitamin C Tube", price: 65 },
      { id: "a16", name: "Mineral Water (1L)", price: 30 }
    ]
  },
  ];

// Promo Codes
const PROMO_CODES = {
  "NIGHT20": { type: "percent", value: 20, min: 300, desc: "20% off on orders above ৳300" },
  "FLAT50":  { type: "flat",    value: 50, min: 500, desc: "৳50 flat off on orders above ৳500" },
  "FREESHIP":{ type: "ship",    value: 0,  min: 400, desc: "Free delivery on orders above ৳400" }
};

const DELIVERY_FEE   = 60;   // ৳60
const PACKAGING_FEE  = 20;   // ৳20
const TAX_RATE       = 0.05; // 5%

function getProductById(id) {
  return LND_CATALOG.find(p => p.id === id) || LND_CATALOG[0];
}