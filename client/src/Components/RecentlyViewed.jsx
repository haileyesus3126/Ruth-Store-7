// src/Components/RecentlyViewed.jsx
import React, { useContext, useEffect, useMemo, useState, memo } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Title from './Title';

const STORAGE_KEY = 'recentlyViewed';
const DEFAULT_MAX_ITEMS = 10;

const normalizeIds = (arr, max = DEFAULT_MAX_ITEMS) => {
  // Ensure strings, drop falsy, keep last MAX unique (most recent first)
  const seen = new Set();
  const out = [];
  for (let i = arr.length - 1; i >= 0 && out.length < max; i--) {
    const v = String(arr[i] ?? '');
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
};

const safeGetLS = (key) => {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const safeSetLS = (key, val) => {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, val);
  } catch {
    /* ignore */
  }
};

const formatPrice = (value, currencySymbol = '$') => {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return `${currencySymbol}0.00`;
  // keep your symbol approach; avoid assuming currency code
  return `${currencySymbol}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const RecentlyViewed = ({ storageKey = STORAGE_KEY, maxItems = DEFAULT_MAX_ITEMS }) => {
  const { products = [], currency = '$' } = useContext(ShopContext);
  const [ids, setIds] = useState([]);
  const [cleared, setCleared] = useState(false);
  const reduceMotion = useReducedMotion();

  // Load IDs on mount and when storage changes (even from another tab)
  useEffect(() => {
    const read = () => {
      try {
        const raw = JSON.parse(safeGetLS(storageKey) || '[]');
        setIds(normalizeIds(Array.isArray(raw) ? raw : [], maxItems));
      } catch {
        setIds([]);
      }
    };
    read();

    const onStorage = (e) => {
      if (e.key === storageKey) read();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey, maxItems]);

  // Resolve products for stored IDs (most recent first)
  const viewed = useMemo(() => {
    if (!ids.length || !products.length) return [];
    const mapById = new Map(products.map((p) => [String(p._id ?? p.id ?? ''), p]));
    return ids.map((id) => mapById.get(String(id))).filter(Boolean);
  }, [ids, products]);

  const clearAll = () => {
    safeSetLS(storageKey, JSON.stringify([]));
    setIds([]);
    setCleared(true);
    // hide message after a moment
    setTimeout(() => setCleared(false), 2000);
  };

  if (viewed.length === 0) return null;

  // Motion presets (subtle)
  const sectionVariants = reduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.06 },
        },
      };

  const cardVariants = reduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 12, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
        hover: { y: -3, scale: 1.02 },
        tap: { scale: 0.99 },
      };

  return (
    <motion.section
      className="max-w-6xl mx-auto px-4 py-12"
      aria-labelledby="recently-viewed-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <div className="flex items-end justify-between gap-3 mb-3">
        <Title
          as="h2"
          id="recently-viewed-heading"
          eyebrow="KEEP BROWSING"
          text1="Recently"
          text2="Viewed"
          align="left"
          highlightClassName="text-black"
          className="mb-0"
        />
        <div className="flex items-center gap-3">
          <span
            className="text-xs text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {viewed.length} item{viewed.length === 1 ? '' : 's'}
          </span>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            aria-label="Clear recently viewed items"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Live region for clear confirmation */}
      {cleared && (
        <motion.p
          className="text-green-600 text-sm mb-3"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Recently viewed list cleared.
        </motion.p>
      )}

      {/* Mobile: horizontal scroll with snap; Desktop: grid */}
      <div className="sm:hidden -mx-4 px-4">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
          aria-label="Recently viewed products"
        >
          {viewed.map((product) => {
            const pid = String(product._id ?? product.id);
            const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image || '/fallback.png';
            return (
              <motion.div
                key={pid}
                className="rv-card group min-w-[70%] snap-start"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to={`/product/${pid}`}
                  className="bg-white shadow-sm rounded-xl overflow-hidden transition rv-cardInner block border border-gray-200"
                  aria-label={`View ${product.name}`}
                >
                  <div className="rv-img bg-white">
                    <img
                      src={imgSrc || '/fallback.png'}
                      alt={`${product.name} product image`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/fallback.png';
                      }}
                      className="w-full h-[220px] object-contain p-3"
                      draggable="false"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[15px] font-medium text-gray-900 line-clamp-2">{product.name}</p>
                    <p className="text-sm text-gray-500 mb-1">{product.subCategory || 'Hallmark'}</p>
                    <p className="text-base font-semibold text-black">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {viewed.map((product) => {
          const pid = String(product._id ?? product.id);
          const imgSrc = Array.isArray(product.image) ? product.image[0] : product.image || '/fallback.png';
          return (
            <motion.div
              key={pid}
              className="rv-card group"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to={`/product/${pid}`}
                className="bg-white shadow-sm rounded-xl overflow-hidden transition rv-cardInner block border border-gray-200 hover:shadow-md"
                aria-label={`View ${product.name}`}
              >
                <div className="rv-img bg-white">
                  <img
                    src={imgSrc || '/fallback.png'}
                    alt={`${product.name} product image`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/fallback.png';
                    }}
                    className="w-full h-[240px] object-contain p-3"
                    draggable="false"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-medium text-gray-900 line-clamp-2">{product.name}</p>
                  <p className="text-sm text-gray-500 mb-1">{product.subCategory || 'Hallmark'}</p>
                  <p className="text-base font-semibold text-black">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};

export default memo(RecentlyViewed);
