import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Title from '../Components/Title';

const occasions = [
  {
    name: 'Birthday Gifts',
    description: 'Thoughtful gifts, cards, chocolates, and keepsakes for birthdays.',
    icon: '🎂',
  },
  {
    name: 'Wedding Gifts',
    description: 'Elegant home décor, premium gifts, and celebration items.',
    icon: '💍',
  },
  {
    name: 'Graduation Gifts',
    description: 'Meaningful gifts for students and new beginnings.',
    icon: '🎓',
  },
  {
    name: 'Baby Shower Gifts',
    description: 'Soft plush toys, baby gifts, and sweet keepsakes.',
    icon: '🧸',
  },
  {
    name: "Mother's Day Gifts",
    description: 'Beautiful gifts for mothers, women, and loved ones.',
    icon: '🌹',
  },
  {
    name: 'Faith & Inspiration',
    description: 'Devotionals, inspirational gifts, and faith-based products.',
    icon: '✝️',
  },
];

const OccasionsPage = () => {
  const reduce = useReducedMotion();

  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };

  const item = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0 },
        hover: { y: -5, scale: 1.02 },
        tap: { scale: 0.98 },
      };

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
      aria-labelledby="occasions-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
    >
      <Title
        as="h1"
        id="occasions-heading"
        eyebrow="SHOP BY"
        text1="Shop by"
        text2="Occasion"
        subtitle="Find meaningful gifts for birthdays, weddings, graduations, baby showers, and special moments."
        align="center"
        highlightClassName="text-black"
        className="mb-10"
      />

      <motion.section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={section}
      >
        {occasions.map((occasion) => {
          const search = new URLSearchParams({
            type: 'category',
            name: 'Gifts & Occasions',
            sub: occasion.name,
          }).toString();

          return (
            <motion.div
              key={occasion.name}
              variants={item}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to={`/collection?${search}`}
                className="group block h-full rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8FAFC] text-3xl">
                  {occasion.icon}
                </div>

                <h2 className="mb-3 text-xl font-bold text-[#0F172A] group-hover:text-[#D4AF37]">
                  {occasion.name}
                </h2>

                <p className="mb-5 text-sm leading-6 text-gray-600">
                  {occasion.description}
                </p>

                <span className="text-sm font-semibold text-[#0F172A] underline-offset-4 group-hover:underline">
                  Explore Gifts →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.section>
    </motion.main>
  );
};

export default memo(OccasionsPage);