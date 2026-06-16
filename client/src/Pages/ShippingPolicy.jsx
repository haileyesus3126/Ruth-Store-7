// src/Pages/ShippingPolicy.jsx
import React, { useEffect, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../Components/Title";

const SUPPORT_EMAIL = "robert.holley@bannermgmt.com";
const SUPPORT_PHONE_TEL = "+13016704140";
const SUPPORT_PHONE_DISPLAY = "+1 301 670 4140";

const ShippingPolicy = () => {
  useEffect(() => window.scrollTo(0, 0), []);
  const reduce = useReducedMotion();

  // Subtle motion presets (respect reduced motion)
  const page = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      };
  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      };

  return (
    <motion.main
      className="max-w-3xl mx-auto px-6 py-14 text-gray-800"
      initial="hidden"
      animate="show"
      variants={page}
      aria-labelledby="ship-title"
    >
      {/* Unified Title */}
      <Title
        as="h1"
        id="ship-title"
        eyebrow="POLICIES"
        text1="Shipping"
        text2="& Delivery"
        subtitle="Learn how we process, ship, and track your orders."
        align="left"
      />

      {/* Processing Times */}
      <motion.section className="mt-6" variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Processing times</h2>
        <p className="mb-6">
          Orders are typically processed within <strong>1–2 business days</strong>.
          Orders placed on weekends or holidays are processed on the next business day.
        </p>
      </motion.section>

      {/* Delivery Estimates */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Delivery estimates</h2>
        <p className="mb-3">
          Transit time begins after your order has been processed and shipped. Typical
          estimates:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
          <li><strong>Standard:</strong> usually <strong>3–7 business days</strong>, depending on destination and carrier.</li>
          <li><strong>Expedited:</strong> faster options may be available at checkout.</li>
        </ul>
        <p className="text-sm text-gray-600">
          Note: Weather, carrier delays, or high-volume seasons may impact delivery windows.
        </p>
      </motion.section>

      {/* Shipping Fees */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Shipping fees</h2>
        <p className="mb-3">
          Shipping costs are calculated at checkout based on order weight, destination,
          and the method selected.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-6">
          <li>Final rates shown before you place your order.</li>
          <li>Any promotional shipping offers will be applied automatically if eligible.</li>
        </ul>
      </motion.section>

      {/* Tracking */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Order tracking</h2>
        <p className="mb-6">
          Once your order ships, you’ll receive a confirmation email with a tracking link.
          Tracking updates are provided by the carrier and may take time to appear.
        </p>
      </motion.section>

      {/* Help / Contact */}
      <motion.section variants={section} className="mt-2 border-t pt-6">
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Questions?</h2>
        <p className="mb-2">
          Reach us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-blue-600">
            {SUPPORT_EMAIL}
          </a>{" "}
          or{" "}
          <a href={`tel:${SUPPORT_PHONE_TEL}`} className="underline">
            {SUPPORT_PHONE_DISPLAY}
          </a>
          .
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </motion.section>
    </motion.main>
  );
};

export default memo(ShippingPolicy);
