
import React, { useMemo, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { filters } from '../assets/assets';
import Title from '../Components/Title'; // ⬅️ use the Title you liked

const BrandsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const reduce = useReducedMotion();

  const brands = Array.isArray(filters?.brands) ? filters.brands : [];
  const normalized = searchTerm.trim().toLocaleLowerCase();

  const filteredBrands = useMemo(() => {
    const list = normalized
      ? brands.filter(b =>
          String(b?.name || '').toLocaleLowerCase().includes(normalized)
        )
      : brands.slice();

    // sort alphabetically by name (case/locale aware)
    return list.sort((a, b) =>
      String(a?.name || '').localeCompare(String(b?.name || ''), undefined, { sensitivity: 'base' })
    );
  }, [brands, normalized]);

  const total = brands.length;
  const count = filteredBrands.length;

  // motion variants (kept subtle)
  const section = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };
  const stagger = reduce ? {} : {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.06 } },
  };
  const item = reduce ? {} : {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 140, damping: 18 } },
    hover:  { y: -3, scale: 1.02 },
    tap:    { scale: 0.99 },
  };

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
      aria-labelledby="brands-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
    >
      {/* Page Title — unified with Title component */}
      <Title
        as="h1"
        id="brands-heading"
        eyebrow="SHOP BY"
        text1="Shop by"
        text2="Brand"
        subtitle="Discover your favorite brands and their latest collections."
        align="center"
        highlightClassName="text-black"
        className="mb-8"
      />

      {/* Search Filter Bar */}
      <motion.div className="mb-6 max-w-md mx-auto" variants={section}>
        <label htmlFor="brand-search" className="sr-only">Search brand</label>
        <div className="relative">
          <input
            id="brand-search"
            type="text"
            placeholder="Search brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 brand-search"
            aria-describedby="brand-results-count"
            autoComplete="off"
          />
          {/* optional search icon hint (purely decorative) */}
          <span aria-hidden="true" className="brand-search-icon">⌕</span>
        </div>
        <motion.p
          id="brand-results-count"
          className="mt-2 text-xs text-gray-500 text-center"
          key={count} // key ensures tiny fade when count changes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {count} of {total} brand{total === 1 ? '' : 's'} shown
        </motion.p>
      </motion.div>

      {/* Brand Grid */}
      {count > 0 ? (
        <motion.section
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          aria-label="Brand results"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {filteredBrands.map((brand, i) => {
            const name = String(brand?.name || 'Brand');
            const desc = brand?.description;
            const tipId = desc ? `brand-tip-${i}` : undefined;

            const search = new URLSearchParams({
              type: 'brand',
              name,
            }).toString();

            return (
              <motion.div
                key={name}
                variants={item}
                whileHover="hover"
                whileTap="tap"
                className="brand-card"
              >
                <Link
                  to={`/collection?${search}`}
                  className="relative group flex flex-col items-center bg-white border border-gray-200 hover:shadow-md rounded-xl p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 brand-cardInner"
                  aria-label={`View ${name} collection`}
                  aria-describedby={tipId}
                >
                  {/* Tooltip on Hover */}
                  {desc && (
                    <div
                      id={tipId}
                      role="tooltip"
                      className="brand-tip"
                    >
                      {desc}
                    </div>
                  )}

                  <img
                    src={brand?.image || '/fallback.png'}
                    alt={`${name} brand logo`}
                    className="w-20 h-20 object-contain mb-4 brand-logo"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/fallback.png'; }}
                    draggable="false"
                  />
                  <span className="text-center text-sm font-medium text-gray-800">
                    {name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.section>
      ) : (
        <p className="text-center text-gray-500 mt-10">No brands match your search.</p>
      )}
    </motion.main>
  );
};

export default memo(BrandsPage);
