// src/Components/OurPolicy.jsx
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "./Title";

const policies = [
  {
    icon: assets.exchange_icon,
    title: "Easy Exchange Policy",
    description: "Enjoy a simple and hassle-free exchange process on your purchases.",
    alt: "Exchange policy icon",
  },
  {
    icon: assets.quality_icon,
    title: "7-Day Return Guarantee",
    description: "Changed your mind? We offer free returns within 7 days.",
    alt: "Return policy icon",
  },
  {
    icon: assets.support_img,
    title: "24/7 Customer Support",
    description: "Our team is always here to help you, day or night.",
    alt: "Customer support icon",
  },
];

const OurPolicy = () => {
  const reduce = useReducedMotion();

  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
        },
      };

  const item = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 120, damping: 16 },
        },
        hover: { y: -4, scale: 1.03 },
        tap: { scale: 0.98 },
      };

  return (
    <section className="py-16 bg-gray-50" aria-labelledby="policies-heading">
      <div className="max-w-6xl mx-auto px-6">
        <Title
          as="h2"
          id="policies-heading"
          eyebrow="OUR PROMISE"
          text1="Why Shop"
          text2="With Us"
          subtitle="We go the extra mile to ensure your experience is seamless, safe, and satisfying."
          align="center"
        />

        <motion.ul
          role="list"
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={section}
        >
          {policies.map(({ icon, title, description, alt }) => (
            <motion.li
              key={title}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center transition"
              variants={item}
              whileHover="hover"
              whileTap="tap"
            >
              <img
                src={icon}
                alt={alt || `${title} icon`}
                loading="lazy"
                className="w-14 h-14 mx-auto mb-4"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{description}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default memo(OurPolicy);
