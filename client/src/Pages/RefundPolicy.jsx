// src/Pages/RefundPolicy.jsx
import React, { useEffect, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../Components/Title";

const SUPPORT_EMAIL = "robert.holley@bannermgmt.com";

const RefundPolicy = () => {
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
      aria-labelledby="refund-title"
    >
      {/* Unified page title */}
      <Title
        as="h1"
        id="refund-title"
        eyebrow="POLICIES"
        text1="Refund"
        text2="Policy"
        subtitle="We offer a 30-day return window. Start your return by emailing Customer Service."
        align="left"
      />

      {/* Return window */}
      <motion.section className="mt-6" variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Return Window</h2>
        <p className="mb-6">
          We have a <strong>30-day return policy</strong>, which means you have 30 days after
          receiving your item to request a return.
        </p>
      </motion.section>

      {/* Eligibility */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Eligibility</h2>
        <p className="mb-3">
          To be eligible for a return, your item must be in the <strong>same condition</strong> that you
          received it—unworn or unused, with tags, and in its original packaging. You’ll also need the
          receipt or proof of purchase.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
          <li>Unworn/unused item</li>
          <li>All original tags attached</li>
          <li>Original packaging included</li>
          <li>Receipt or proof of purchase</li>
        </ul>
      </motion.section>

      {/* How to start a return */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>How to Start a Return</h2>
        <p className="mb-3">
          To start a return, contact us at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-blue-600">
            {SUPPORT_EMAIL}
          </a>.
        </p>
        <p className="mb-2">
          If your return is accepted, we’ll send you a return shipping label and instructions on how
          and where to send your package.
        </p>
        <p className="mb-6">
          <strong>Items sent back to us without first requesting a return will not be accepted.</strong>
        </p>
      </motion.section>

      {/* Damages & issues */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Damages &amp; Issues</h2>
        <p className="mb-6">
          Please inspect your order upon reception and contact us immediately if the item is
          defective, damaged, or if you receive the wrong item, so that we can evaluate the issue and
          make it right.
        </p>
      </motion.section>

      {/* Exceptions */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Exceptions / Non-returnable Items</h2>
        <p className="mb-3">
          Certain types of items cannot be returned, including:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
          <li>Perishable goods (e.g., food, flowers, plants)</li>
          <li>Custom or personalized products (special orders)</li>
          <li>Personal care goods (e.g., beauty products)</li>
          <li>Hazardous materials, flammable liquids, or gases</li>
        </ul>
        <p className="mb-2">Please get in touch if you have questions about your specific item.</p>
        <p className="mb-10">
          Unfortunately, we cannot accept returns on <strong>sale items</strong> or{" "}
          <strong>gift cards</strong>.
        </p>
      </motion.section>

      {/* Exchanges */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Exchanges</h2>
        <p className="mb-10">
          The fastest way to ensure you get what you want is to return the item you have and, once the
          return is accepted, make a separate purchase for the new item.
        </p>
      </motion.section>

      {/* Refunds */}
      <motion.section variants={section}>
        <h2 className="text-xl font-semibold mb-2" tabIndex={-1}>Refunds</h2>
        <p className="mb-6">
          We will notify you once we’ve received and inspected your return, and let you know if the
          refund was approved or not. If approved, you’ll be automatically refunded on your original
          payment method. Please remember it can take some time for your bank or credit card company
          to process and post the refund too.
        </p>
      </motion.section>

      {/* Help CTA */}
      <motion.section variants={section} className="mt-8 border-t pt-6 text-sm text-gray-600">
        <p>
          Questions? Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="underline text-blue-600">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <p className="mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.section>
    </motion.main>
  );
};

export default memo(RefundPolicy);
