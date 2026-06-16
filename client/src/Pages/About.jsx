// src/Components/About.jsx
import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Title from '../Components/Title';

const About = () => {
  const reduce = useReducedMotion();

  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };

  const stagger = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: 'easeOut',
            staggerChildren: 0.08,
            when: 'beforeChildren',
          },
        },
      };

  const item = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      };

  return (
    <motion.main
      className="max-w-6xl mx-auto px-6 py-16 text-gray-800"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
      aria-labelledby="about-heading"
    >
      <Title
        as="h1"
        id="about-heading"
        eyebrow="OUR STORY"
        text1="About"
        text2="Ruth Store"
        subtitle="Meaningful Gifts For Every Occasion."
        align="center"
        highlightClassName="text-black"
        className="mb-10"
      />

      <motion.section className="mb-12" variants={stagger}>
        <motion.p className="text-lg sm:text-xl leading-relaxed text-gray-700" variants={item}>
          <strong>Ruth Store</strong> is a premium gift and lifestyle boutique dedicated
          to helping people celebrate life&apos;s special moments. Our collection includes
          elegant gifts, home décor, handbags, stationery, faith-inspired products,
          chocolates, plush toys, and meaningful keepsakes carefully selected for
          customers in Ethiopia.
        </motion.p>
      </motion.section>

      <motion.section aria-labelledby="about-stats" className="mb-12" variants={stagger}>
        <h2 id="about-stats" className="sr-only">Company Snapshot</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { big: '100+', small: 'Gift Products' },
            { big: 'Premium', small: 'Brands' },
            { big: 'Ethiopia', small: 'Location' },
            { big: 'Store', small: 'Showroom Experience' },
          ].map(({ big, small }) => (
            <motion.div
              key={small}
              className="rounded-xl border border-gray-200 bg-white/70 p-4 text-center shadow-sm hover:shadow-md transition"
              variants={item}
              whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.99 }}
            >
              <p className="text-3xl font-bold tracking-tight">{big}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">{small}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section className="grid md:grid-cols-2 gap-10 mb-12" variants={stagger}>
        <motion.div variants={item}>
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            Ruth Store was created with a simple vision: to become one of Ethiopia&apos;s
            most trusted destinations for premium gifts, lifestyle products, and
            meaningful keepsakes. We aim to provide a boutique shopping experience
            where customers can discover carefully curated collections for every
            celebration and occasion.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-2xl font-semibold mb-3">What Makes Us Different</h2>
          <p className="text-gray-600 leading-relaxed">
            Unlike traditional online stores, Ruth Store allows customers to browse
            products online and then visit our physical store to experience the quality,
            design, and beauty of each product before purchasing. This approach combines
            the convenience of online discovery with the confidence of in-store shopping.
          </p>
        </motion.div>
      </motion.section>

      <motion.section className="mb-12" variants={stagger} aria-labelledby="core-values-title">
        <h2 id="core-values-title" className="text-2xl font-semibold mb-3">Our Core Values</h2>
        <motion.p className="text-gray-600 leading-relaxed mb-3" variants={item}>
          Everything we do at Ruth Store is guided by values that help us create
          exceptional experiences for our customers:
        </motion.p>

        <motion.ul className="list-disc list-inside space-y-2 text-gray-700" variants={stagger}>
          {[
            <>Deliver <strong>quality and excellence</strong> in every product we offer.</>,
            <>Create <strong>meaningful customer experiences</strong> through outstanding service.</>,
            <>Offer <strong>carefully curated collections</strong> for every occasion.</>,
            <>Operate with <strong>integrity, honesty, and professionalism</strong>.</>,
          ].map((li, i) => (
            <motion.li key={i} variants={item}>{li}</motion.li>
          ))}
        </motion.ul>

        <motion.p className="text-gray-600 leading-relaxed mt-3" variants={item}>
          These values help us build trust, serve customers with care, and create a
          premium boutique experience for families, women, gift buyers, and communities
          across Ethiopia.
        </motion.p>
      </motion.section>

      <motion.section aria-labelledby="about-contact" className="text-center" variants={section}>
        <h2 id="about-contact" className="text-2xl font-semibold mb-3">
          Visit Ruth Store
        </h2>

        <p className="text-gray-600">
          Browse our collections online and visit our store to discover premium gifts,
          home décor, stationery, handbags, faith-inspired products, and meaningful
          keepsakes for every occasion.
        </p>

        <p className="mt-3 text-gray-600">
          Visit our{' '}
          <a
            href="/contact"
            className="text-blue-600 underline hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
          >
            Contact Page
          </a>{' '}
          for store location, hours, and additional information.
        </p>
      </motion.section>
    </motion.main>
  );
};

export default memo(About);