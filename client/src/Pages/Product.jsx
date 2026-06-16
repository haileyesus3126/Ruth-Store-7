// src/Pages/Product.jsx
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  memo,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { motion, useReducedMotion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const formatCurrency = (amount, symbol = "$") =>
  `${symbol}${Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getImageUrl = (img) => {
  if (!img) return "/fallback.png";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${API_URL}${img}`;
  return img;
};

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currency, addToCart, wishlist = [], toggleWishlist } =
    useContext(ShopContext);

  const reduce = useReducedMotion();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const ctaRef = useRef(null);
  const toastTimerRef = useRef(null);
  const modalRef = useRef(null);
  const lastFocusRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/products/${id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const images = useMemo(() => {
    const rawImages =
      product?.images && product.images.length > 0
        ? product.images
        : product?.image
        ? Array.isArray(product.image)
          ? product.image
          : [product.image]
        : [];

    if (!rawImages.length) return ["/fallback.png"];

    return rawImages.map(getImageUrl);
  }, [product]);

  const requireSize = Array.isArray(product?.sizes) && product.sizes.length > 0;

  useEffect(() => {
    if (product && !requireSize) {
      setSelectedSize("default");
    }
  }, [product, requireSize]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const productId = String(product._id ?? product.id);

    try {
      const prev = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      const deduped = [
        productId,
        ...prev.filter((x) => String(x) !== productId),
      ].slice(0, 12);

      localStorage.setItem("recentlyViewed", JSON.stringify(deduped));
    } catch {}
  }, [product]);

  const isInWishlist =
    !!product && wishlist.map(String).includes(String(product._id ?? product.id));

  const mainImage = images[selectedImageIndex] || "/fallback.png";

  const safeToast = useCallback((msg, ms = 2500) => {
    setMessage(msg);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    if (ms > 0) {
      toastTimerRef.current = setTimeout(() => setMessage(""), ms);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const ensureSizeOrWarn = () => {
    if (requireSize && !selectedSize) {
      safeToast("⚠️ Please select a size first!", 3000);
      return false;
    }

    return true;
  };

  const handleAddToCart = async () => {
    if (!ensureSizeOrWarn()) return;

    const productId = String(product._id ?? product.id);

    await addToCart(productId, selectedSize || "default", 1);

    safeToast(
      `✅ Added to cart${requireSize ? ` · Size ${selectedSize}` : ""}`
    );
  };

  const handleBuyNow = async () => {
    if (!ensureSizeOrWarn()) return;

    const productId = String(product._id ?? product.id);

    await addToCart(productId, selectedSize || "default", 1);

    navigate("/place-order");
  };

  const renderStars = (rating = 0) => {
    const value = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
  };

  const prevImage = (event) => {
    event?.stopPropagation?.();

    setSelectedImageIndex((index) => (index - 1 + images.length) % images.length);
  };

  const nextImage = (event) => {
    event?.stopPropagation?.();

    setSelectedImageIndex((index) => (index + 1) % images.length);
  };

  useEffect(() => {
    if (!showZoom) return;

    lastFocusRef.current = document.activeElement;
    document.body.style.overflow = "hidden";

    const modalElement = modalRef.current;

    if (!modalElement) return;

    const focusableSelector =
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';

    const getNodes = () =>
      Array.from(modalElement.querySelectorAll(focusableSelector));

    const trapFocus = (event) => {
      if (event.key !== "Tab") return;

      const nodes = getNodes();

      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onKey = (event) => {
      if (event.key === "Escape") setShowZoom(false);
      if (event.key === "ArrowLeft") prevImage();
      if (event.key === "ArrowRight") nextImage();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("keydown", trapFocus);

    setTimeout(() => {
      const nodes = getNodes();
      (nodes[0] || modalElement).focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keydown", trapFocus);
      document.body.style.overflow = "";
      lastFocusRef.current?.focus?.();
    };
  }, [showZoom, images.length]);

  const shareLink = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          url,
        });

        safeToast("🔗 Link shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        safeToast("🔗 Link copied");
      } else {
        safeToast("Copy failed — unsupported browser", 3000);
      }
    } catch {
      safeToast("Share canceled", 2000);
    }
  };

  useEffect(() => {
    if (!ctaRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: "0px 0px -20% 0px",
      }
    );

    observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, [product]);

  const sectionV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };

  const fadeV = reduce
    ? {}
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { duration: 0.35 },
        },
      };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <p className="text-center mt-10 text-lg text-red-500">
        ❌ Product not found
      </p>
    );
  }

  const stock = typeof product.stock === "number" ? product.stock : null;
  const outOfStock = stock === 0;

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 text-gray-800"
      initial="hidden"
      animate="show"
      variants={sectionV}
    >
      <nav
        className="md:col-span-2 text-sm text-gray-500 -mt-2 mb-2"
        aria-label="Breadcrumb"
      >
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>

          <li aria-hidden="true">/</li>

          <li>
            <Link to="/collection" className="hover:underline">
              Collection
            </Link>
          </li>

          <li aria-hidden="true">/</li>

          <li
            className="text-gray-700 truncate max-w-[50ch]"
            aria-current="page"
          >
            {product.name}
          </li>
        </ol>
      </nav>

      <motion.section variants={fadeV}>
        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center relative">
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1 text-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-1 text-xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <button
            className="relative cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-black/20 rounded"
            onClick={() => setShowZoom(true)}
            aria-label="Open zoom view"
            title="Click to zoom"
          >
            <img
              src={mainImage}
              alt={`${product.name} image`}
              className="w-full max-w-sm object-contain"
              onError={(event) => {
                event.currentTarget.src = "/fallback.png";
              }}
              loading="lazy"
              decoding="async"
              width={640}
              height={640}
              draggable="false"
            />

            <span className="absolute bottom-2 right-2 text-xs text-white bg-black/80 px-2 py-1 rounded">
              🔍 Zoom
            </span>
          </button>
        </div>

        {images.length > 1 && (
          <div
            className="flex gap-2 mt-4"
            role="listbox"
            aria-label="Select product image"
          >
            {images.map((img, index) => {
              const selected = index === selectedImageIndex;

              return (
                <button
                  key={index}
                  className={`w-16 h-16 border rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-black/20 ${
                    selected ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Image ${index + 1}`}
                  aria-selected={selected}
                  role="option"
                >
                  <img
                    src={img || "/fallback.png"}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                    onError={(event) => {
                      event.currentTarget.src = "/fallback.png";
                    }}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </button>
              );
            })}
          </div>
        )}
      </motion.section>

      <motion.section variants={fadeV}>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          <button
            onClick={shareLink}
            className="text-sm border px-3 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/20"
            aria-label="Share product link"
          >
            🔗 Share
          </button>
        </div>

        <p className="text-xl text-black font-semibold mt-2">
          {formatCurrency(product.price, currency)}
        </p>

        {product.rating != null && (
          <div
            className="flex items-center gap-2 text-yellow-500 mt-1 text-sm"
            aria-label={`Rating ${product.rating} out of 5`}
          >
            <span>{renderStars(product.rating)}</span>
            <span className="text-gray-500 text-xs">
              ({product.reviews || 0} reviews)
            </span>
          </div>
        )}

        {typeof stock === "number" && (
          <p
            className={`mt-2 text-sm ${
              outOfStock ? "text-red-600" : "text-gray-600"
            }`}
          >
            {outOfStock ? "Out of stock" : `In stock: ${stock}`}
          </p>
        )}

        {product.description && (
          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            {product.description}
          </p>
        )}

        {requireSize && (
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-2">Select Size:</h2>

            <div role="radiogroup" aria-label="Size" className="flex gap-3 flex-wrap">
              {product.sizes.map((size) => {
                const checked = selectedSize === size;

                return (
                  <button
                    key={size}
                    role="radio"
                    aria-checked={checked}
                    onClick={() => setSelectedSize(size)}
                    className={`border px-4 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
                      checked
                        ? "bg-black text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={ctaRef} className="flex gap-4 mt-6 flex-wrap">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`px-6 py-3 rounded text-white transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={outOfStock}
            className={`px-6 py-3 rounded text-white transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Buy Now
          </button>

          <button
            onClick={async () => {
              await toggleWishlist(String(product._id ?? product.id));
              safeToast(
                isInWishlist
                  ? "💔 Removed from wishlist"
                  : "❤️ Added to wishlist",
                2000
              );
            }}
            className={`border px-6 py-3 rounded transition focus:outline-none focus:ring-2 focus:ring-black/20 ${
              isInWishlist
                ? "bg-red-100 text-red-600 border-red-400 hover:bg-red-200"
                : "border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
            aria-pressed={isInWishlist}
          >
            {isInWishlist ? "💔 Remove" : "❤️ Wishlist"}
          </button>
        </div>

        <p
          className="mt-4 text-sm font-medium text-green-600 min-h-[1.25rem]"
          aria-live="polite"
        >
          {message}
        </p>
      </motion.section>

      {showZoom && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed product image"
          onClick={() => setShowZoom(false)}
        >
          <div
            ref={modalRef}
            className="relative max-w-5xl w-full outline-none"
            onClick={(event) => event.stopPropagation()}
            tabIndex={-1}
          >
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 rounded-full px-3 py-1 text-2xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
                  aria-label="Previous image"
                >
                  ‹
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 rounded-full px-3 py-1 text-2xl hover:bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}

            <img
              src={mainImage}
              alt={`${product.name} zoomed view`}
              className="w-full h-auto object-contain max-h-[80vh] rounded"
              onError={(event) => {
                event.currentTarget.src = "/fallback.png";
              }}
              loading="eager"
              decoding="async"
              draggable="false"
            />

            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black/40 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setShowZoom(false)}
              aria-label="Close zoom"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {!outOfStock && showStickyBar && (
        <div className="sticky-atc md:hidden" role="region" aria-label="Quick actions">
          {requireSize && !selectedSize ? (
            <p className="text-xs text-red-700 font-medium mb-2">
              Select a size to add to cart
            </p>
          ) : (
            <p className="text-xs text-gray-700 mb-2">
              {formatCurrency(product.price, currency)}
              {requireSize && selectedSize ? ` · Size ${selectedSize}` : ""}
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={requireSize && !selectedSize}
              className="flex-1 px-4 py-3 rounded bg-black text-white disabled:opacity-50"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={requireSize && !selectedSize}
              className="flex-1 px-4 py-3 rounded bg-green-600 text-white disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </motion.main>
  );
};

export default memo(Product);