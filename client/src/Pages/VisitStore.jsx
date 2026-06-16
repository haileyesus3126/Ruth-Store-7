import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Title from '../Components/Title';

const storeFeatures = [
  {
    title: 'Browse Online',
    text: 'Explore products, brands, gifts, and collections from your phone.',
    icon: '🛍️',
  },
  {
    title: 'Visit Our Store',
    text: 'Come in person to see the quality, color, size, and packaging.',
    icon: '📍',
  },
  {
    title: 'Buy In Store',
    text: 'Choose your favorite products and purchase directly at Ruth Store.',
    icon: '🎁',
  },
];

const VisitStore = () => {
  const reduce = useReducedMotion();

  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
      };

  return (
    <motion.main
      className="max-w-6xl mx-auto px-4 py-12 text-gray-800"
      aria-labelledby="visit-store-heading"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
    >
      <Title
        as="h1"
        id="visit-store-heading"
        eyebrow="VISIT US"
        text1="Visit"
        text2="Ruth Store"
        subtitle="Ruth Store is a premium boutique showroom in Ethiopia. Browse online, then visit our shop to buy in person."
        align="center"
        highlightClassName="text-black"
        className="mb-10"
      />

      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-[#0F172A] p-8 text-white sm:p-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Ruth Store Ethiopia
            </p>

            <h2 className="mb-5 font-serif text-4xl font-semibold leading-tight">
              Premium gifts you can experience in person.
            </h2>

            <p className="mb-8 text-sm leading-7 text-white/75">
              We are building Ruth Store as a trusted boutique showroom where customers
              can discover elegant gifts online and visit the physical shop to buy with
              confidence.
            </p>

            <div className="space-y-4 text-sm">
              <p>
                <span className="font-semibold text-[#D4AF37]">Location:</span>{' '}
                Addis Ababa, Ethiopia
              </p>

              <p>
                <span className="font-semibold text-[#D4AF37]">Model:</span>{' '}
                Browse online, buy in store
              </p>

              <p>
                <span className="font-semibold text-[#D4AF37]">Products:</span>{' '}
                Gifts, handbags, home décor, cards, candles, chocolates, plush toys
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/collection"
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-center text-sm font-semibold text-[#0F172A] transition hover:bg-white"
              >
                Explore Collection
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white hover:text-[#0F172A]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <h3 className="mb-6 text-2xl font-bold text-[#0F172A]">
              How It Works
            </h3>

            <div className="space-y-5">
              {storeFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {feature.icon}
                  </div>

                  <div>
                    <h4 className="mb-1 font-bold text-[#0F172A]">
                      {feature.title}
                    </h4>
                    <p className="text-sm leading-6 text-gray-600">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 p-5">
              <h4 className="mb-2 font-bold text-[#0F172A]">
                Store details coming soon
              </h4>
              <p className="text-sm leading-6 text-gray-600">
                Add your exact shop address, phone number, opening hours, and Google Map
                here when your location is ready.
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default memo(VisitStore);