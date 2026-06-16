// src/Pages/HolidaysPage.jsx
import React, { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { filters } from '../assets/assets';
import Title from '../Components/Title'; // ✅ use the shared Title

const HolidaysPage = () => {
  const [search, setSearch] = useState('');
  const reduce = useReducedMotion();

  const holidays = Array.isArray(filters?.holidays) ? filters.holidays : [];
  const normalized = search.trim().toLowerCase();

  const filteredHolidays = useMemo(() => {
    const list = normalized
      ? holidays.filter(h => String(h?.name || '').toLowerCase().includes(normalized))
      : holidays.slice();

    // sort A→Z for nicer scan
    return list.sort((a, b) =>
      String(a?.name || '').localeCompare(String(b?.name || ''), undefined, { sensitivity: 'base' })
    );
  }, [holidays, normalized]);

  const total = holidays.length;
  const count = filteredHolidays.length;

  // motion variants (subtle)
  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      };

  const grid = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.06 },
        },
      };

  const card = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
        hover: { y: -3, scale: 1.02 },
        tap: { scale: 0.99 },
      };

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
      aria-labelledby="holidays-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
    >
      {/* Page Title — unified with Title component */}
      <Title
        as="h1"
        id="holidays-heading"
        eyebrow="SHOP BY"
        text1="Shop by"
        text2="Holiday"
        subtitle="Find gifts and décor for every holiday."
        align="center"
        highlightClassName="text-black"
        className="mb-8"
      />

      {/* Search Input */}
      <motion.div className="mb-6 max-w-md mx-auto" variants={section}>
        <label htmlFor="holiday-search" className="sr-only">
          Search for a holiday
        </label>
        <div className="relative">
          <input
            id="holiday-search"
            type="text"
            placeholder="Search for a holiday..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hol-search"
            aria-describedby="holiday-results-count"
            autoComplete="off"
          />
          {/* decorative search hint */}
          <span aria-hidden="true" className="hol-search-icon">
            ⌕
          </span>
        </div>
        <motion.p
          id="holiday-results-count"
          className="mt-2 text-xs text-gray-500 text-center"
          key={count}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {count} of {total} holiday{total === 1 ? '' : 's'} shown
        </motion.p>
      </motion.div>

      {/* Holiday Grid */}
      {count > 0 ? (
        <motion.section
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          aria-label="Holiday results"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {filteredHolidays.map((holiday, i) => {
            const name = String(holiday?.name || 'Holiday');
            const desc = holiday?.description;
            const tipId = desc ? `hol-tip-${i}` : undefined;

            return (
              <motion.div
                key={name}
                variants={card}
                whileHover="hover"
                whileTap="tap"
                className="hol-card"
              >
                <Link
                  to={`/collection?type=holiday&name=${encodeURIComponent(name)}`}
                  className="relative group flex flex-col items-center bg-white border border-gray-200 hover:shadow-md rounded-xl p-5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 hol-cardInner"
                  aria-label={`View ${name} collection`}
                  aria-describedby={tipId}
                >
                  {/* Tooltip */}
                  {desc && (
                    <div id={tipId} role="tooltip" className="hol-tip">
                      {desc}
                    </div>
                  )}

                  <img
                    src={holiday?.image || '/fallback.png'}
                    alt={`${name} icon`}
                    className="w-20 h-20 object-contain mb-4 hol-logo"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/fallback.png';
                    }}
                    draggable="false"
                  />
                  <span className="text-center text-sm font-medium text-gray-800">{name}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.section>
      ) : (
        <motion.p className="text-center text-gray-500 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          No holidays match your search.
        </motion.p>
      )}
    </motion.main>
  );
};

export default memo(HolidaysPage);
