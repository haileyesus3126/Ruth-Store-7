import React, { useContext, useMemo, useEffect, useState, memo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (amount, symbol = "$") =>
  `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (raw) => {
  const t = Date.parse(raw);
  if (Number.isNaN(t)) return String(raw || "");
  return new Date(t).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Profile = () => {
  const {
    user,
    setUser,
    logout,
    wishlist = [],
    products = [],
    currency = "$",
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        setOrdersLoading(true);

        const response = await fetch(`${API_URL}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setRecentOrders(data.orders.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load recent orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const userObj = {
            ...data.user,
            token,
          };

          setUser(userObj);
          localStorage.setItem("user", JSON.stringify(userObj));
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };

    fetchProfile();
  }, [setUser]);

  const productById = useMemo(() => {
    const map = new Map();

    for (const p of products) {
      const key = String(p?._id ?? p?.id ?? "");
      if (key) map.set(key, p);
    }

    return map;
  }, [products]);

  const wishlistProducts = useMemo(() => {
    const ids = wishlist.map(String);
    const items = ids.map((id) => productById.get(id)).filter(Boolean);

    return {
      items,
      preview: items.slice(0, 4),
    };
  }, [wishlist, productById]);

  const page = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const card = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35 },
        },
      };

  const list = reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06 },
        },
      };

  const row = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25 },
        },
      };

  if (!user) {
    return (
      <motion.div
        className="text-center mt-20 text-gray-600"
        initial="hidden"
        animate="show"
        variants={page}
      >
        <p className="text-lg">You are not logged in.</p>
        <Link
          to="/login?redirect=/profile"
          className="text-blue-600 hover:underline"
        >
          Go to Login →
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.main
      className="max-w-5xl mx-auto px-6 py-12 text-gray-800"
      initial="hidden"
      animate="show"
      variants={page}
      aria-labelledby="profile-title"
    >
      <Title
        as="h1"
        id="profile-title"
        eyebrow="MY ACCOUNT"
        text1="Your"
        text2="Profile"
        subtitle={`Signed in as ${user.email}`}
        align="left"
      />

      <motion.section
        className="bg-white rounded-lg p-6 mb-8 shadow-sm border prof-card"
        variants={card}
      >
        <h2 className="text-xl font-semibold mb-4">Account Details</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>

          <p>
            <span className="font-medium">Name:</span>{" "}
            {user.name || "Not set"}
          </p>

          <p>
            <span className="font-medium">Phone:</span>{" "}
            {user.phone || "Not set"}
          </p>

          <p className="sm:col-span-2">
            <span className="font-medium">Address:</span>{" "}
            {user.address || "Not set"}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/edit-profile"
            className="px-4 py-2 text-white rounded transition relative overflow-hidden prof-cta bg-gray-900 hover:bg-gray-800"
          >
            Edit Profile
            <span aria-hidden="true" className="prof-shine" />
          </Link>

          <Link
            to="/orders"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            View Orders
          </Link>
        </div>
      </motion.section>

      <motion.section
        className="bg-white rounded-lg p-6 mb-8 shadow-sm border prof-card"
        variants={card}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>

          {recentOrders.length > 0 && (
            <Link to="/orders" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          )}
        </div>

        {ordersLoading ? (
          <p className="text-sm text-gray-600">Loading orders...</p>
        ) : recentOrders.length === 0 ? (
          <div className="text-sm text-gray-600">
            No recent orders yet.{" "}
            <Link
              className="text-blue-600 hover:underline"
              to="/collection?filter=new"
            >
              Explore new arrivals →
            </Link>
          </div>
        ) : (
          <motion.div
            className="divide-y prof-list"
            variants={list}
            initial="hidden"
            animate="show"
          >
            {recentOrders.map((ord) => {
              const itemCount =
                ord.items?.reduce(
                  (n, item) => n + (Number(item.quantity) || 0),
                  0
                ) || 0;

              return (
                <motion.div
                  key={ord._id}
                  className="py-4 flex items-center justify-between prof-row"
                  variants={row}
                >
                  <div>
                    <p className="font-medium">
                      Order #{String(ord._id).slice(-6)}
                    </p>

                    <p className="text-sm text-gray-600">
                      {formatDate(ord.createdAt)}
                    </p>

                    <p className="text-sm text-gray-600">
                      {itemCount} item{itemCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(ord.totalPrice, currency)}
                    </p>

                    <Link
                      to="/orders"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

      <motion.section
        className="bg-white rounded-lg p-6 mb-8 shadow-sm border prof-card"
        variants={card}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Wishlist</h2>

          <span className="text-sm text-gray-600">
            {wishlistProducts.items.length} item
            {wishlistProducts.items.length === 1 ? "" : "s"}
          </span>
        </div>

        {wishlistProducts.items.length === 0 ? (
          <p className="text-sm text-gray-600">
            Your wishlist is empty.{" "}
            <Link
              to="/collection?filter=bestseller"
              className="text-blue-600 hover:underline"
            >
              See best sellers →
            </Link>
          </p>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              variants={list}
              initial="hidden"
              animate="show"
            >
              {wishlistProducts.preview.map((p) => {
                const pid = String(p._id ?? p.id);
                const img = Array.isArray(p.image) ? p.image[0] : p.image;

                return (
                  <motion.div key={pid} variants={row}>
                    <Link
                      to={`/product/${pid}`}
                      className="group border rounded-lg overflow-hidden hover:shadow transition bg-white prof-wish block"
                      aria-label={`View ${p.name}`}
                    >
                      <img
                        src={img || "/fallback.png"}
                        alt={`${p.name} product image`}
                        className="w-full h-36 object-contain bg-gray-50 p-2"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback.png";
                        }}
                        draggable="false"
                      />

                      <div className="p-2">
                        <p className="text-sm font-medium group-hover:underline line-clamp-2">
                          {p.name}
                        </p>

                        <p className="text-sm text-gray-700 mt-1">
                          {formatCurrency(p.price, currency)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {wishlistProducts.items.length > 4 && (
              <div className="mt-3">
                <Link to="/wishlist" className="text-blue-600 hover:underline">
                  View all wishlist →
                </Link>
              </div>
            )}
          </>
        )}
      </motion.section>

      <div className="flex justify-end">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="px-4 py-2 text-white rounded transition relative overflow-hidden prof-cta bg-red-600 hover:bg-red-500"
        >
          Logout
          <span aria-hidden="true" className="prof-shine" />
        </button>
      </div>
    </motion.main>
  );
};

export default memo(Profile);