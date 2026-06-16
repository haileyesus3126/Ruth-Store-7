// src/Pages/CustomerService.jsx
import React, { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../Components/Title";

const SUPPORT_EMAIL = "Robert.Holley@bannermgmt.com";
const SUPPORT_PHONE_DISPLAY = "+1 301 670 4140";
const SUPPORT_PHONE_TEL = "+13016704140";

const CustomerService = () => {
  const reduce = useReducedMotion();
  useEffect(() => window.scrollTo(0, 0), []);

  // motion variants (subtle, Reduce Motion–aware)
  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      };
  const cards = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, staggerChildren: 0.08 } },
      };
  const cardItem = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
        hover: { y: -3, scale: 1.02 },
      };

  return (
    <motion.main
      className="max-w-5xl mx-auto px-6 py-16 text-gray-800"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={section}
      aria-labelledby="cs-heading"
    >
      <Title
        as="h1"
        id="cs-heading"
        eyebrow="SUPPORT"
        text1="Customer"
        text2="Service"
        align="center"
        subtitle={
          <>
            Concerns? Questions? Email Rob at{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-blue-600 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
            >
              {SUPPORT_EMAIL}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${SUPPORT_PHONE_TEL}`}
              className="text-blue-600 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>
            .
          </>
        }
      />

      {/* Quick info cards */}
      <motion.section className="grid sm:grid-cols-3 gap-4 mt-6" variants={cards} aria-label="Contact options">
        {[
          {
            label: "Call us",
            value: SUPPORT_PHONE_DISPLAY,
            href: `tel:${SUPPORT_PHONE_TEL}`,
            note: "Mon–Fri · 9am–5pm ET",
          },
          {
            label: "Email",
            value: SUPPORT_EMAIL,
            href: `mailto:${SUPPORT_EMAIL}`,
            note: "Typical reply in 1–2 business days",
          },
          {
            label: "Headquarters",
            value: "Gaithersburg, MD",
            href: null,
            note: null,
          },
        ].map(({ label, value, href, note }) => (
          <motion.div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition"
            variants={cardItem}
            whileHover="hover"
          >
            <p className="text-sm text-gray-500">{label}</p>
            {href ? (
              <a
                href={href}
                className="text-lg font-semibold text-gray-900 break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15 rounded"
              >
                {value}
              </a>
            ) : (
              <p className="text-lg font-semibold text-gray-900">{value}</p>
            )}
            {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
          </motion.div>
        ))}
      </motion.section>

      {/* Helpful links */}
      <motion.div className="mt-10 text-center text-gray-600 space-y-2" variants={section}>
        <p>
          Quick answers:{" "}
          <Link to="/delivery" className="text-blue-600 underline">
            Shipping & Delivery
          </Link>{" "}
          ·{" "}
          <Link to="/refund-policy" className="text-blue-600 underline">
            Refund Policy
          </Link>{" "}
          ·{" "}
          <Link to="/orders" className="text-blue-600 underline">
            Your Orders
          </Link>
        </p>
        <p className="text-xs">
          For your security, please don’t include credit card numbers or other sensitive information.
        </p>
      </motion.div>
    </motion.main>
  );
};

export default memo(CustomerService);
