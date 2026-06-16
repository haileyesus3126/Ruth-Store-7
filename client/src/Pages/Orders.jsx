// src/Pages/Orders.jsx
import React, { useContext, useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (amount, symbol = "$") => {
  const n = Number(amount ?? 0);

  return `${symbol}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const safeDate = (raw) => {
  const t = Date.parse(raw);

  if (Number.isNaN(t)) return String(raw || "");

  return new Date(t).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getImageUrl = (image) => {
  if (!image) return "/fallback.png";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  return image;
};

const Orders = () => {
  const { currency = "$" } = useContext(ShopContext);

  const reduce = useReducedMotion();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };

  const cardV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 12, scale: 0.99 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const listV = reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06 },
        },
      };

  const rowV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35 },
        },
      };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view orders.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load orders.");
          return;
        }

        setOrders(data.orders || []);
      } catch {
        setError("Server error while loading orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <motion.main
        className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
        initial="hidden"
        animate="show"
        variants={pageV}
      >
        <Title
          as="h1"
          eyebrow="ACCOUNT"
          text1="Your"
          text2="Orders"
          align="left"
        />

        <p className="text-center text-gray-500 mt-10">Loading orders...</p>
      </motion.main>
    );
  }

  if (error) {
    return (
      <motion.main
        className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
        initial="hidden"
        animate="show"
        variants={pageV}
      >
        <Title
          as="h1"
          eyebrow="ACCOUNT"
          text1="Your"
          text2="Orders"
          align="left"
        />

        <p className="text-center text-red-600 mt-10">{error}</p>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
            Go to Login →
          </Link>
        </div>
      </motion.main>
    );
  }

  if (!orders.length) {
    return (
      <motion.main
        className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
        initial="hidden"
        animate="show"
        variants={pageV}
        aria-labelledby="orders-heading"
      >
        <Title
          as="h1"
          id="orders-heading"
          eyebrow="ACCOUNT"
          text1="Your"
          text2="Orders"
          align="left"
        />

        <p className="text-center text-gray-500 mt-10">No orders found.</p>

        <div className="mt-6 text-center">
          <Link to="/collection" className="text-blue-600 underline hover:text-blue-800">
            Browse products →
          </Link>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
      initial="hidden"
      animate="show"
      variants={pageV}
      aria-labelledby="orders-heading"
    >
      <Title
        as="h1"
        id="orders-heading"
        eyebrow="ACCOUNT"
        text1="Your"
        text2="Orders"
        align="left"
        subtitle="View your recent purchases and order details."
        className="mb-4"
      />

      {orders.map((order) => {
        const itemsCount =
          order.items?.reduce(
            (total, item) => total + (Number(item.quantity) || 0),
            0
          ) || 0;

        return (
          <motion.section
            key={order._id}
            className="border rounded-lg p-6 mb-6 shadow-sm bg-white ord-card"
            aria-labelledby={`order-title-${order._id}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardV}
          >
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
              <div>
                <h2
                  id={`order-title-${order._id}`}
                  className="text-base font-semibold"
                >
                  Order{" "}
                  <span className="text-gray-700">
                    #{String(order._id).slice(-6)}
                  </span>
                </h2>

                <p className="text-sm text-gray-500">
                  Placed on {safeDate(order.createdAt)}
                </p>
              </div>

              <div className="text-sm">
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {order.orderStatus}
                  </span>
                </p>

                <p>
                  Payment:{" "}
                  <span className="font-medium capitalize">
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </header>

            <motion.ul className="space-y-4" variants={listV}>
              {order.items?.map((item) => {
                const productId = String(item.product);
                const imgSrc = getImageUrl(item.image);
                const unit = Number(item.price) || 0;
                const qty = Number(item.quantity) || 0;
                const lineTotal = unit * qty;

                return (
                  <motion.li
                    key={`${productId}_${item.size}`}
                    className="flex items-center gap-4 border-b pb-4 ord-line"
                    variants={rowV}
                  >
                    <Link
                      to={`/product/${productId}`}
                      className="shrink-0 ord-imgWrap"
                      aria-label={`Open ${item.name}`}
                    >
                      <img
                        src={imgSrc}
                        alt={`${item.name} product image`}
                        className="w-20 h-20 object-contain bg-gray-100 rounded ord-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback.png";
                        }}
                        draggable="false"
                        width={80}
                        height={80}
                      />
                    </Link>

                    <div className="flex-grow min-w-0">
                      <Link
                        to={`/product/${productId}`}
                        className="font-medium hover:underline line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {item.size ? (
                        <p className="text-sm text-gray-600">
                          Size: {item.size}
                        </p>
                      ) : null}

                      <p className="text-sm text-gray-600">Qty: {qty}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Unit: {formatCurrency(unit, currency)}
                      </p>

                      <p className="font-semibold">
                        {formatCurrency(lineTotal, currency)}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>

            <footer className="mt-4 flex items-center justify-between flex-wrap gap-3 ord-total">
              <p className="text-sm text-gray-600">
                {itemsCount} item{itemsCount === 1 ? "" : "s"}
              </p>

              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Items: {formatCurrency(order.itemsPrice, currency)}
                </p>

                <p className="text-sm text-gray-600">
                  Delivery: {formatCurrency(order.deliveryFee, currency)}
                </p>

                <p className="text-base font-semibold">
                  Order total: {formatCurrency(order.totalPrice, currency)}
                </p>
              </div>
            </footer>
          </motion.section>
        );
      })}

      <div className="mt-6 text-center text-sm text-gray-600">
        Need help with an order?{" "}
        <Link to="/customer-service" className="text-blue-600 underline">
          Contact Customer Service
        </Link>
        .
      </div>
    </motion.main>
  );
};

export default memo(Orders);