// src/Components/LatestCollection.jsx
import React, { useContext, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

// robust time getter: tries several common keys, falls back to 0
const toTime = (p) => {
  const keys = ['date', 'createdAt', 'created_at', 'addedAt', 'updatedAt'];
  for (const k of keys) {
    const v = p?.[k];
    if (!v) continue;
    const t = new Date(v).getTime();
    if (Number.isFinite(t)) return t;
  }
  return 0;
};

// Deduplicate by product id
const pid = (p) => String(p?._id ?? p?.id ?? '');

const LatestCollection = ({ max = 10 }) => {
  const { products = [] } = useContext(ShopContext);
  const reduce = useReducedMotion();

  // Derive newest products (unique by id)
  const latestProducts = useMemo(() => {
    const map = new Map();
    for (const p of products) {
      const id = pid(p);
      if (id) map.set(id, p);
    }
    const list = Array.from(map.values());
    list.sort((a, b) => toTime(b) - toTime(a));
    return list.slice(0, max);
  }, [products, max]);

  // Motion presets
  const section = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const grid = reduce ? {} : {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.06 } },
  };
  const card = reduce ? {} : {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
    hover:  { y: -4, scale: 1.02 },
    tap:    { scale: 0.99 },
  };

  if (latestProducts.length === 0) {
    return null; // hide section entirely if nothing to show
  }

  return (
    <motion.section
      className="container mx-auto px-4 sm:px-8 lg:px-16 my-12"
      aria-labelledby="latest-collection-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
    >
      {/* Title & intro */}
      <div className="flex items-end justify-between gap-3">
        <Title
          as="h2"
          id="latest-collection-heading"
          eyebrow="JUST IN"
          text1="Latest"
          text2="Collections"
          subtitle="Discover the freshest picks from our new arrivals — uniquely designed items for every celebration."
          align="left"
          className="mb-6"
        />
        <div className="hidden sm:block mb-2">
          <Link
            to="/collection?filter=new"
            className="text-sm text-gray-700 underline hover:text-black"
            aria-label="View the full collection of new arrivals"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* Mobile: horizontal scroll with snap */}
      <div className="sm:hidden -mx-4 px-4">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
          aria-label="Latest products"
        >
          {latestProducts.map((item) => {
            const key = pid(item);
            return (
              <motion.div
                key={key}
                className="min-w-[72%] snap-start"
                variants={card}
                whileHover="hover"
                whileTap="tap"
              >
                <ProductItem
                  id={item._id || item.id}
                  image={item.image}
                  name={item.name}
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
        variants={grid}
      >
        {latestProducts.map((item) => {
          const key = pid(item);
          return (
            <motion.div key={key} variants={card} whileHover="hover" whileTap="tap">
              <ProductItem
                id={item._id || item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                rating={item.rating}
                reviews={item.reviews}
                bestseller={!!item.bestseller}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All (mobile) */}
      <div className="sm:hidden mt-6 text-center">
        <Link
          to="/collection?filter=new"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition relative overflow-hidden"
          aria-label="View the full collection of new arrivals"
        >
          View Full Collection →
        </Link>
      </div>
    </motion.section>
  );
};

export default memo(LatestCollection);
