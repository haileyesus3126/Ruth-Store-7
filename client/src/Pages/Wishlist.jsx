import React, { useContext, useMemo, useState, memo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../Components/Title";

const formatCurrency = (amount, symbol = "$") =>
  `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Wishlist = () => {
  const {
    wishlist = [],
    products = [],
    currency = "$",
    removeFromWishlist,
    addToCart,
  } = useContext(ShopContext);

  const [status, setStatus] = useState("");

  const wishedSet = useMemo(() => new Set(wishlist.map(String)), [wishlist]);

  const wishedProducts = useMemo(
    () =>
      products.filter((product) => {
        const productId = String(product?._id ?? product?.id ?? "");
        return productId && wishedSet.has(productId);
      }),
    [products, wishedSet]
  );

  const count = wishedProducts.length;

  const reduce = useReducedMotion();

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

  const list = reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.06 },
        },
      };

  const card = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.3 },
        },
        hover: { y: -3, scale: 1.02 },
        tap: { scale: 0.99 },
      };

  const handleQuickAdd = async (product) => {
    const productId = String(product._id ?? product.id);
    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

    if (hasSizes) return;

    await addToCart(productId, "default", 1);

    setStatus(`✅ Added “${product.name}” to cart`);

    window.clearTimeout(handleQuickAdd._timer || 0);
    handleQuickAdd._timer = window.setTimeout(() => setStatus(""), 2200);
  };

  const handleRemove = async (product) => {
    const productId = String(product._id ?? product.id);

    await removeFromWishlist(productId);

    setStatus(`Removed “${product.name}” from wishlist`);

    window.clearTimeout(handleRemove._timer || 0);
    handleRemove._timer = window.setTimeout(() => setStatus(""), 2200);
  };

  const estTotal = useMemo(
    () => wishedProducts.reduce((sum, product) => sum + (Number(product.price) || 0), 0),
    [wishedProducts]
  );

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-10 text-gray-800"
      initial="hidden"
      animate="show"
      variants={page}
      aria-labelledby="wl-title"
    >
      <div className="mb-2">
        <Title
          as="h1"
          id="wl-title"
          eyebrow="SAVED ITEMS"
          text1="Your"
          text2="Wishlist"
          subtitle="Keep track of items you love. Add to cart now or continue browsing."
          align="left"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-gray-600">
          {count} item{count === 1 ? "" : "s"}
          {count > 0 && (
            <>
              {" "}
              · Est. total value:{" "}
              <span className="font-medium">
                {formatCurrency(estTotal, currency)}
              </span>
            </>
          )}
        </p>

        <div className="text-sm">
          <Link to="/collection" className="text-blue-600 hover:underline">
            Browse Collection →
          </Link>
        </div>
      </div>

      <p
        className={`h-5 text-sm mb-4 ${
          status ? "text-green-600" : "text-transparent"
        }`}
        role="status"
        aria-live="polite"
      >
        {status || "placeholder"}
      </p>

      {count === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>

          <Link
            to="/collection"
            className="inline-block px-5 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
          >
            Start Shopping →
          </Link>
        </div>
      ) : (
        <motion.section
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          variants={list}
          initial="hidden"
          animate="show"
          aria-label="Wishlist items"
        >
          {wishedProducts.map((product) => {
            const productId = String(product._id ?? product.id);

            const image =
              (Array.isArray(product.image)
                ? product.image[0]
                : product.image) || "/fallback.png";

            const hasSizes =
              Array.isArray(product.sizes) && product.sizes.length > 0;

            return (
              <motion.article
                key={productId}
                className="border p-4 rounded-xl shadow-sm text-center bg-white wl-card group transition"
                variants={card}
                whileHover="hover"
                whileTap="tap"
              >
                <Link to={`/product/${productId}`} className="block">
                  <div className="bg-gray-50 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={image}
                      alt={`${product.name} product image`}
                      className="w-full h-40 object-contain p-2 wl-img"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = "/fallback.png";
                      }}
                      draggable="false"
                    />
                  </div>
                </Link>

                <Link to={`/product/${productId}`}>
                  <p className="text-sm sm:text-[15px] font-medium text-gray-800 hover:underline transition line-clamp-2">
                    {product.name}
                  </p>
                </Link>

                <p className="text-gray-700 mt-1 mb-3">
                  {formatCurrency(product.price, currency)}
                </p>

                <div className="flex items-center justify-center gap-3">
                  {!hasSizes ? (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="text-xs px-3 py-2 rounded bg-black text-white hover:bg-gray-800 transition relative overflow-hidden wl-cta"
                      title="Add to cart"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Add to Cart
                      <span aria-hidden="true" className="wl-shine" />
                    </button>
                  ) : (
                    <Link
                      to={`/product/${productId}`}
                      className="text-xs px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 transition wl-ghost"
                      title="Select size"
                      aria-label={`Select a size for ${product.name}`}
                    >
                      Select Size
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(product)}
                    title="Remove from wishlist"
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="text-xs text-red-600 hover:underline wl-remove"
                  >
                    ❤️ Remove
                  </button>
                </div>
              </motion.article>
            );
          })}
        </motion.section>
      )}
    </motion.main>
  );
};

export default memo(Wishlist);