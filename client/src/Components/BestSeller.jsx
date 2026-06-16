// src/Components/BestSeller.jsx
import React, { useContext, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

// Helpers
const idOf = (p) => String(p?._id ?? p?.id ?? '');
const toTime = (p) => {
  // Try a few common date keys; fallback to 0
  for (const k of ['date', 'createdAt', 'created_at', 'addedAt', 'updatedAt']) {
    const v = p?.[k];
    if (!v) continue;
    const t = new Date(v).getTime();
    if (Number.isFinite(t)) return t;
  }
  return 0;
};
const popularity = (p) =>
  (Number(p?.rating) || 0) * (Number(p?.reviews) || 0);

const BestSeller = ({ limit = 5, sortBy = 'popularity' }) => {
  const { products = [] } = useContext(ShopContext);
  const reduce = useReducedMotion();

  // Deduplicate by id (in case upstream data contains repeats)
  const unique = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const id = idOf(p);
      if (id) map.set(id, p);
    }
    return Array.from(map.values());
  }, [products]);

  const bestSeller = useMemo(() => {
    // Only items explicitly flagged as bestseller
    const list = unique.filter((p) => !!p?.bestseller);

    const sorted = list.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'priceDesc':
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'newest':
          return toTime(b) - toTime(a);
        case 'popularity':
        default:
          return popularity(b) - popularity(a);
      }
    });

    return sorted.slice(0, limit);
  }, [unique, limit, sortBy]);

  if (bestSeller.length === 0) {
    return null; // hide section if nothing to show
  }

  // Motion variants
  const sectionV = reduce
    ? {}
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } };

  const gridV = reduce
    ? {}
    : { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };

  const cardV = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 14, scale: 0.98 },
        show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
        hover:  { y: -4, scale: 1.02 },
        tap:    { scale: 0.99 },
      };

  return (
    <motion.section
      className="container mx-auto px-4 sm:px-8 lg:px-16 py-12"
      aria-labelledby="best-sellers-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionV}
    >
      {/* Title + top-right link */}
      <div className="flex items-end justify-between gap-3 mb-6">
        <Title
          as="h2"
          id="best-sellers-heading"
          eyebrow="TOP PICKS"
          text1="Best"
          text2="Sellers"
          subtitle="Customer favorites that combine quality, style, and value."
          align="left"
          className="mb-0"
        />
        <div className="hidden sm:block mb-2">
          <Link
            to="/collection?filter=bestseller&sort=popularity"
            className="text-sm text-gray-700 underline hover:text-black"
            aria-label="View all bestsellers"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Mobile: horizontal snap scroll */}
      <div className="sm:hidden -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" aria-label="Best sellers">
          {bestSeller.map((item) => {
            const key = idOf(item);
            return (
              <motion.div
                key={key}
                className="min-w-[72%] snap-start"
                variants={cardV}
                whileHover="hover"
                whileTap="tap"
              >
                <ProductItem
                  id={item._id || item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                  reviews={item.reviews}
                  bestseller={!!item.bestseller}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Desktop: grid */}
      <motion.div
        className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        variants={gridV}
      >
        {bestSeller.map((item) => {
          const key = idOf(item);
          return (
            <motion.div key={key} variants={cardV} whileHover="hover" whileTap="tap" className="group relative">
              <ProductItem
                id={item._id || item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                rating={item.rating}
                reviews={item.reviews}
                bestseller={!!item.bestseller}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Mobile CTA */}
      <div className="sm:hidden mt-8 text-center">
        <Link
          to="/collection?filter=bestseller&sort=popularity"
          className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition relative overflow-hidden"
          aria-label="View all bestsellers"
        >
          View All Bestsellers →
        </Link>
      </div>
    </motion.section>
  );
};

export default memo(BestSeller);
