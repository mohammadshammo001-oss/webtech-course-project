// Late Night Delivery - Cart Logic 

const CART_KEY  = "lnd_cart";
const PROMO_KEY = "lnd_promo";
const ORDER_KEY = "lnd_last_order";

// Separators used instead of JSON (control characters, never typed by users)
const ITEM_SEP   = "\u0003";  // between cart items
const FIELD_SEP  = "\u0002";  // between fields of one item
const ADDON_SEP  = "\u0001";  // between add-ons of one item
const ADDON_FLD  = "\u0004";  // between fields of one add-on
const ORDER_SEP  = "\u0005";  // between fields of the saved order

function clean(text) {
  return String(text == null ? "" : text).replace(/[\u0001-\u0005]/g, "");
}

// ---- Pack / unpack 

function packAddOns(addOns) {
  return (addOns || []).map(a => [clean(a.id), clean(a.name), a.price].join(ADDON_FLD)).join(ADDON_SEP);
}

function unpackAddOns(text) {
  if (!text) return [];
  return text.split(ADDON_SEP).map(part => {
    const f = part.split(ADDON_FLD);
    return { id: f[0], name: f[1], price: Number(f[2]) };
  });
}

function packItem(item) {
  return [
    clean(item.cartId),
    clean(item.productId),
    clean(item.name),
    item.price,
    item.qty,
    clean(item.image),
    packAddOns(item.addOns),
    clean(item.note)
  ].join(FIELD_SEP);
}

function unpackItem(text) {
  const f = text.split(FIELD_SEP);
  return {
    cartId: f[0],
    productId: f[1],
    name: f[2],
    price: Number(f[3]),
    qty: Number(f[4]),
    image: f[5],
    addOns: unpackAddOns(f[6]),
    note: f[7] || ""
  };
}

function packItems(items) {
  return items.map(packItem).join(ITEM_SEP);
}

function unpackItems(text) {
  if (!text) return [];
  return text.split(ITEM_SEP).map(unpackItem);
}

// 
(function clearOldFormat() {
  [CART_KEY, ORDER_KEY].forEach(key => {
    const v = localStorage.getItem(key);
    if (v && (v.charAt(0) === "[" || v.charAt(0) === "{")) {
      localStorage.removeItem(key);
    }
  });
})();

// Load sample items on first visit
(function seedCart() {
  if (localStorage.getItem(CART_KEY) === null) {
    const sample = [
      {
        cartId: "prod-101__",
        productId: "prod-101",
        name: "Midnight Double Cheeseburger",
        price: 320,
        qty: 1,
        image: "images/burger.jpg",
        addOns: [],
        note: ""
      },
      {
        cartId: "prod-103__",
        productId: "prod-103",
        name: "Buffalo Wings (12 Pcs)",
        price: 350,
        qty: 1,
        image: "images/chicken.jpg",
        addOns: [],
        note: ""
      }
    ];
    localStorage.setItem(CART_KEY, packItems(sample));
    localStorage.setItem(PROMO_KEY, "NIGHT20");
  }
})();

// ---- Cart CRUD ----

function getCart() {
  try { return unpackItems(localStorage.getItem(CART_KEY)); }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, packItems(cart));
  updateCartBadge();
}

function addToCart(product, qty, addOns, note) {
  const cart = getCart();
  const addonIds = addOns.map(a => a.id).sort().join("|");
  const cartId = product.id + "__" + addonIds;

  const existing = cart.find(i => i.cartId === cartId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      cartId,
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
      image: product.image,
      addOns,
      note: note || ""
    });
  }

  saveCart(cart);
  showToast("Added to cart: " + product.name, "success");
}

function updateQty(cartId, newQty) {
  let cart = getCart();
  if (newQty <= 0) {
    cart = cart.filter(i => i.cartId !== cartId);
    showToast("Item removed", "");
  } else {
    const item = cart.find(i => i.cartId === cartId);
    if (item) item.qty = newQty;
  }
  saveCart(cart);
  return getCart();
}

function removeItem(cartId) {
  let cart = getCart().filter(i => i.cartId !== cartId);
  saveCart(cart);
  showToast("Item removed from cart", "");
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((s, i) => s + i.qty, 0);
}

// ---- Promo ----

function getPromo() {
  return localStorage.getItem(PROMO_KEY) || "";
}

function applyPromo(code) {
  const key = code.trim().toUpperCase();
  const promo = PROMO_CODES[key];
  if (!promo) return { ok: false, msg: "Invalid promo code." };

  const totals = calcTotals();
  if (totals.subtotal < promo.min) {
    return { ok: false, msg: "Order must be at least ৳" + promo.min + " to use this code." };
  }

  localStorage.setItem(PROMO_KEY, key);
  showToast("Promo applied: " + promo.desc, "success");
  return { ok: true, msg: "Promo applied!" };
}

function removePromo() {
  localStorage.removeItem(PROMO_KEY);
}

// ---- Totals ----

function calcTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, item) => {
    const addonCost = item.addOns.reduce((a, x) => a + x.price, 0);
    return s + (item.price + addonCost) * item.qty;
  }, 0);

  let delivery = cart.length > 0 ? DELIVERY_FEE : 0;
  let discount = 0;
  const promoCode = getPromo();
  const promo = promoCode ? PROMO_CODES[promoCode] : null;

  if (promo) {
    if (promo.type === "percent") discount = Math.round(subtotal * promo.value / 100);
    if (promo.type === "flat")    discount = promo.value;
    if (promo.type === "ship")    delivery = 0;
  }

  const afterDiscount = Math.max(0, subtotal - discount);
  const tax = Math.round(afterDiscount * TAX_RATE);
  const packaging = cart.length > 0 ? PACKAGING_FEE : 0;
  const grand = afterDiscount + delivery + packaging + tax;

  return { subtotal, delivery, discount, tax, packaging, grand, promo };
}

// ---- Place Order ----

function placeOrder(details) {
  const totals = calcTotals();
  const orderId = "LND-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const arrivalMin = 28;
  const arrival = new Date(now.getTime() + arrivalMin * 60000);

  const order = {
    orderId,
    placedAt: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    arrivalAt: arrival.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    arrivalMin,
    items: getCart(),
    totals,
    address: details.address,
    payment: details.payment,
    note: details.note || "",
    rider: {
      name: "Rahim",
      phone: "+880 1712-345678",
      rating: "5.00",
      vehicle: "Honda"
    }
  };

  saveOrder(order);
  clearCart();
  removePromo();
  return order;
}

function saveOrder(o) {
  const t = o.totals;
  const parts = [
    o.orderId, o.placedAt, o.arrivalAt, o.arrivalMin,
    o.address, o.payment, o.note,
    o.rider.name, o.rider.phone, o.rider.rating, o.rider.vehicle,
    t.subtotal, t.delivery, t.discount, t.tax, t.packaging, t.grand,
    packItems(o.items)
  ].map(clean);
  // items already contain their own separators, so re-add them after cleaning
  parts[17] = packItems(o.items);
  localStorage.setItem(ORDER_KEY, parts.join(ORDER_SEP));
}

function getLastOrder() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return null;
    const f = raw.split(ORDER_SEP);
    return {
      orderId: f[0],
      placedAt: f[1],
      arrivalAt: f[2],
      arrivalMin: Number(f[3]),
      address: f[4],
      payment: f[5],
      note: f[6],
      rider: { name: f[7], phone: f[8], rating: f[9], vehicle: f[10] },
      totals: {
        subtotal: Number(f[11]),
        delivery: Number(f[12]),
        discount: Number(f[13]),
        tax: Number(f[14]),
        packaging: Number(f[15]),
        grand: Number(f[16])
      },
      items: unpackItems(f[17])
    };
  } catch(e) { return null; }
}

// ---- Badge & Toast ----

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "inline" : "none";
  });
}

function showToast(msg, type) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const t = document.createElement("div");
  t.className = "toast " + (type || "");
  t.textContent = msg;
  container.appendChild(t);

  setTimeout(() => {
    if (t.parentElement) t.parentElement.removeChild(t);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", updateCartBadge);