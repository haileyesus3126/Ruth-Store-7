// src/Pages/Cart.jsx
import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../Components/Title";

const FREE_SHIPPING_THRESHOLD = 75;

const formatCurrency = (amount, symbol = "$") => {
  const n = Number(amount ?? 0);
  const safe = Number.isFinite(n) ? n : 0;

  return `${symbol}${safe.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const Cart = () => {
  const reduce = useReducedMotion();

  const {
    cartItems = {},
    products = [],
    removeFromCart,
    setItemQuantity,
    delivery_fee = 0,
    currency = "$",
  } = useContext(ShopContext);

  const cartEntries = useMemo(() => {
    return Object.entries(cartItems)
      .map(([key, qty]) => {
        const [productId, size] = key.split("_");

        const product = products.find(
          (p) => String(p._id ?? p.id) === String(productId)
        );

        return product
          ? {
              key,
              qty: Math.max(0, Number(qty) || 0),
              size,
              product,
            }
          : null;
      })
      .filter(Boolean)
      .filter((entry) => entry.qty > 0);
  }, [cartItems, products]);

  const subtotal = cartEntries.reduce(
    (acc, { product, qty }) => acc + (Number(product.price) || 0) * qty,
    0
  );

  const qualifiesFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping =
    cartEntries.length > 0 ? (qualifiesFree ? 0 : delivery_fee) : 0;
  const total = subtotal + shipping;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(
    100,
    Math.round(
      (Math.min(subtotal, FREE_SHIPPING_THRESHOLD) /
        FREE_SHIPPING_THRESHOLD) *
        100
    )
  );

  const sectionV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

  const rowV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  if (cartEntries.length === 0) {
    return (
      <motion.main
        className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-700"
        initial="hidden"
        animate="show"
        variants={sectionV}
      >
        <Title
          as="h1"
          text1="Your"
          text2="Cart"
          align="center"
          subtitle="Looks like it’s empty."
        />

        <p className="mt-3">
          Start exploring our latest arrivals and best sellers to fill it up.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/collection?filter=new"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Shop New Arrivals
          </Link>

          <Link to="/" className="text-blue-600 underline hover:text-blue-800">
            Back to Home
          </Link>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionV}
    >
      <div className="mb-4">
        <Title
          as="h1"
          eyebrow="YOUR BAG"
          text1="Shopping"
          text2="Cart"
          align="left"
          subtitle="Review your items and proceed to secure checkout."
          className="mb-0"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div
            className="mb-6 p-4 rounded-lg border bg-white shadow-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            {qualifiesFree ? (
              <p className="text-sm font-medium text-green-700 mb-2">
                🎉 You’ve unlocked free shipping!
              </p>
            ) : (
              <p className="text-sm text-gray-700 mb-2">
                You’re{" "}
                <span className="font-semibold">
                  {formatCurrency(remaining, currency)}
                </span>{" "}
                away from free shipping.
              </p>
            )}

            <div
              className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-label="Free shipping progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
            >
              <div
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <ul className="space-y-6">
            {cartEntries.map(({ key, qty, size, product }) => {
              const pid = String(product._id ?? product.id);
              const imgSrc =
                (Array.isArray(product.image)
                  ? product.image[0]
                  : product.image) || "/fallback.png";

              const line = (Number(product.price) || 0) * qty;

              return (
                <motion.li
                  key={key}
                  className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 gap-4 sm:gap-8"
                  variants={rowV}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-gray-100 rounded p-2">
                      <img
                        src={imgSrc}
                        alt={`${product.name} product image`}
                        className="w-20 h-20 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback.png";
                        }}
                        loading="lazy"
                        width={80}
                        height={80}
                        draggable="false"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        to={`/product/${pid}`}
                        className="font-semibold text-gray-900 hover:underline line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      {size ? (
                        <p className="text-sm text-gray-500">Size: {size}</p>
                      ) : null}

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            setItemQuantity(pid, size, Math.max(0, qty - 1))
                          }
                          className="border px-2 rounded hover:bg-gray-100"
                          aria-label={`Decrease quantity for ${product.name}`}
                        >
                          -
                        </button>

                        <span className="text-sm min-w-6 text-center">
                          {qty}
                        </span>

                        <button
                          type="button"
                          onClick={() => setItemQuantity(pid, size, qty + 1)}
                          className="border px-2 rounded hover:bg-gray-100"
                          aria-label={`Increase quantity for ${product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm font-medium text-gray-900 mt-2">
                        {formatCurrency(line, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => removeFromCart(pid, size)}
                      className="text-red-600 hover:underline text-sm"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <div className="mt-6">
            <Link
              to="/collection"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              Continue shopping
            </Link>
          </div>
        </section>

        <aside className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-5 shadow-sm sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(subtotal, currency)}
                </span>
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

              <p className="text-[11px] text-gray-500 pt-1">
                Taxes and discounts calculated at checkout.
              </p>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>

            <Link
              to="/place-order"
              className="block mt-6 bg-black text-white text-center px-6 py-3 rounded hover:bg-gray-800 transition"
              aria-label="Proceed to checkout"
            >
              Go to Checkout
            </Link>
          </div>
        </aside>
      </div>
    </motion.main>
  );
};

export default Cart;