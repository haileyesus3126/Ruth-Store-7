// src/Pages/PlaceOrder.jsx
import React, { useContext, useMemo, useRef, useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;
const FREE_SHIPPING_THRESHOLD = 75;

const formatCurrency = (amount, symbol = "$") =>
  `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const PlaceOrder = () => {
  const {
    cartItems = {},
    products = [],
    currency = "$",
    delivery_fee = 20,
    clearCart,
    user,
  } = useContext(ShopContext);

  const reduce = useReducedMotion();
  const timerRef = useRef(null);

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    postalCode: "",
    country: "USA",
  });

  useEffect(() => {
    setShippingForm((prev) => ({
      ...prev,
      fullName: user?.name || prev.fullName,
      phone: user?.phone || prev.phone,
      address: user?.address || prev.address,
    }));
  }, [user]);

  const cartEntries = useMemo(() => {
    return Object.entries(cartItems)
      .map(([key, qty]) => {
        const [rawId, sizeRaw] = key.split("_");
        const pid = String(rawId);
        const size = sizeRaw || "default";
        const product =
          products.find((p) => String(p._id ?? p.id) === pid) || null;

        return product ? { key, qty: Number(qty) || 0, size, product, pid } : null;
      })
      .filter(Boolean)
      .filter((line) => line.qty > 0);
  }, [cartItems, products]);

  const subtotal = useMemo(
    () =>
      cartEntries.reduce(
        (acc, { qty, product }) => acc + (Number(product.price) || 0) * qty,
        0
      ),
    [cartEntries]
  );

  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = cartEntries.length > 0 ? (qualifiesFree ? 0 : delivery_fee) : 0;
  const total = subtotal + shipping;

  const pageV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const listV = reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06 } },
      };

  const rowV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;

    setShippingForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const validateShipping = () => {
    if (!shippingForm.fullName.trim()) return "Full name is required.";
    if (!shippingForm.phone.trim()) return "Phone number is required.";
    if (!shippingForm.address.trim()) return "Address is required.";
    if (!shippingForm.city.trim()) return "City is required.";
    return "";
  };

  const handlePlaceOrder = async () => {
    setError("");

    if (!agree) {
      setError("Please agree to the Terms & Privacy Policy to place your order.");
      return;
    }

    if (cartEntries.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const shippingError = validateShipping();

    if (shippingError) {
      setError(shippingError);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to place an order.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: shippingForm.fullName.trim(),
            phone: shippingForm.phone.trim(),
            address: shippingForm.address.trim(),
            city: shippingForm.city.trim(),
            postalCode: shippingForm.postalCode.trim(),
            country: shippingForm.country.trim() || "USA",
          },
          paymentMethod: "cash",
          note: note.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to place order.");
        setLoading(false);
        return;
      }

      setOrderId(data.order?._id);
      clearCart();
      setOrderPlaced(true);
    } catch {
      setError("Server error while placing order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, []);

  if (cartEntries.length === 0 && !orderPlaced) {
    return (
      <div className="text-center py-20 text-gray-600">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/collection" className="text-blue-600 underline hover:text-blue-800">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800"
      initial="hidden"
      animate="show"
      variants={pageV}
      aria-labelledby="place-order-heading"
    >
      <Title
        as="h1"
        id="place-order-heading"
        eyebrow="CHECKOUT"
        text1="Review &"
        text2="Place Order"
        align="left"
        subtitle="Confirm your items and delivery details below."
        className="mb-6"
      />

      {orderPlaced ? (
        <motion.section
          className="text-center py-10 bg-white border rounded-xl shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
        >
          <div
            className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl"
            aria-hidden="true"
          >
            ✓
          </div>

          <h2 className="text-2xl font-semibold text-green-700 mb-2">
            Order Placed Successfully!
          </h2>

          {orderId && (
            <p className="text-gray-700 mb-5">
              Your Order ID:{" "}
              <span className="font-semibold">#{String(orderId).slice(-6)}</span>
            </p>
          )}

          <div className="flex justify-center gap-4">
            <Link
              to="/orders"
              className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
            >
              View Orders
            </Link>

            <Link
              to="/collection"
              className="inline-block border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.section>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="mb-6 p-4 bg-gray-50 border rounded-lg">
              <h2 className="font-semibold mb-4">Shipping Information</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="fullName"
                  value={shippingForm.fullName}
                  onChange={handleShippingChange}
                  placeholder="Full name"
                  className="border border-gray-300 rounded px-3 py-2"
                />

                <input
                  name="phone"
                  value={shippingForm.phone}
                  onChange={handleShippingChange}
                  placeholder="Phone"
                  className="border border-gray-300 rounded px-3 py-2"
                />

                <input
                  name="address"
                  value={shippingForm.address}
                  onChange={handleShippingChange}
                  placeholder="Address"
                  className="border border-gray-300 rounded px-3 py-2 sm:col-span-2"
                />

                <input
                  name="city"
                  value={shippingForm.city}
                  onChange={handleShippingChange}
                  placeholder="City"
                  className="border border-gray-300 rounded px-3 py-2"
                />

                <input
                  name="postalCode"
                  value={shippingForm.postalCode}
                  onChange={handleShippingChange}
                  placeholder="Postal code"
                  className="border border-gray-300 rounded px-3 py-2"
                />

                <input
                  name="country"
                  value={shippingForm.country}
                  onChange={handleShippingChange}
                  placeholder="Country"
                  className="border border-gray-300 rounded px-3 py-2 sm:col-span-2"
                />
              </div>
            </div>

            <motion.ul className="space-y-6" variants={listV} initial="hidden" animate="show">
              {cartEntries.map(({ key, qty, size, product, pid }) => {
                const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image;
                const lineTotal = (Number(product.price) || 0) * qty;

                return (
                  <motion.li key={key} className="flex items-center gap-4 border-b pb-4" variants={rowV}>
                    <Link to={`/product/${pid}`} className="shrink-0">
                      <img
                        src={imgSrc || "/fallback.png"}
                        alt={`${product.name} product image`}
                        className="w-20 h-20 object-contain bg-gray-100 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback.png";
                        }}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${pid}`} className="font-medium hover:underline line-clamp-2">
                        {product.name}
                      </Link>

                      <p className="text-sm text-gray-600">Size: {size}</p>
                      <p className="text-sm text-gray-600">Qty: {qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(lineTotal, currency)}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="mt-6">
              <label htmlFor="po-note" className="block text-sm font-medium mb-1">
                Order note <span className="text-gray-400">(optional)</span>
              </label>

              <textarea
                id="po-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/15"
                placeholder="Add delivery notes or gift messages…"
              />
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-5 shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="mb-4 text-sm">
                {qualifiesFree ? (
                  <p className="text-green-700">🎉 You’ve unlocked free shipping!</p>
                ) : (
                  <p className="text-gray-700">
                    Spend{" "}
                    <span className="font-semibold">
                      {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal, currency)}
                    </span>{" "}
                    more for free shipping.
                  </p>
                )}

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-black transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (Math.min(subtotal, FREE_SHIPPING_THRESHOLD) /
                            FREE_SHIPPING_THRESHOLD) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal, currency)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {qualifiesFree ? (
                      <span className="text-green-700">FREE</span>
                    ) : (
                      formatCurrency(shipping, currency)
                    )}
                  </span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm">
                <input
                  id="po-agree"
                  type="checkbox"
                  className="mt-1"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />

                <label htmlFor="po-agree">
                  I agree to the <Link to="/terms" className="underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>.
                </label>
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !agree}
                className={`w-full mt-6 bg-black text-white px-6 py-3 rounded transition ${
                  loading || !agree ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
                }`}
              >
                {loading ? "Placing Order…" : "Place Order"}
              </button>

              <div className="mt-4 text-center">
                <Link to="/cart" className="text-sm text-blue-600 underline hover:text-blue-800">
                  ← Back to Cart
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </motion.main>
  );
};

export default memo(PlaceOrder);