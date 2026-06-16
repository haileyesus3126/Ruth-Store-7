// src/Components/Hero.jsx
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { assets } from '../assets/assets';

const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  // Variants for staggered entrance
  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  const buttonMotion = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.45, type: 'spring', stiffness: 120 },
    },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const imageMotion = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
    hover: { scale: 1.03 },
  };

  return (
    <section
      aria-labelledby="home-hero-title"
      aria-describedby="home-hero-tagline"
      className="container mx-auto px-4 sm:px-8 lg:px-16 my-10"
      role="region"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={container}
        className="flex flex-col-reverse sm:flex-row border border-gray-300 rounded-lg overflow-hidden shadow-sm"
      >
        {/* Left Side */}
        <motion.div
          variants={item}
          className="w-full sm:w-1/2 flex items-center justify-center p-10 bg-white text-[#414141]"
        >
          <motion.div
            variants={container}
            className="max-w-md text-center sm:text-left"
          >
            {/* tagline */}
            <motion.div
              variants={item}
              className="flex items-center justify-center sm:justify-start gap-2 mb-3"
            >
              <div className="w-8 h-[2px] bg-[#414141]" />
              <p className="text-sm font-medium">LATEST ARRIVALS</p>
            </motion.div>

            {/* heading */}
            <motion.h1
              id="home-hero-title"
              variants={item}
              className="prata-regular text-3xl sm:text-4xl lg:text-5xl leading-snug font-bold mb-4"
            >
              Latest Arrivals
            </motion.h1>

            {/* description */}
            <motion.p
              id="home-hero-tagline"
              variants={item}
              className="text-gray-600 mb-6 text-sm sm:text-base"
            >
              Discover new trends, iconic designs, and timeless gifts in our
              curated collection of fresh finds.
            </motion.p>

            {/* button */}
            <motion.div variants={buttonMotion} whileHover="hover" whileTap="tap">
              <Link
                to="/collection?filter=new"
                className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
                aria-label="Shop the latest arrivals"
              >
                Shop Now →
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          variants={imageMotion}
          whileHover="hover"
          className="w-full sm:w-1/2 bg-gray-50 flex items-center justify-center p-6"
        >
          <motion.img
            src={assets.hero_img}
            alt="Assorted Banner’s Hallmark gifts and keepsakes"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            width={800}
            height={600}
            className="max-w-full max-h-[400px] object-contain"
            sizes="(min-width: 640px) 50vw, 100vw"
            draggable="false"
            onError={(e) => {
              e.currentTarget.src = '/fallback.png';
            }}
            animate={{ y: [0, -6, 0] }} // float loop
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(Hero);
