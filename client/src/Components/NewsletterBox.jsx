// src/Components/NewsletterBox.jsx
import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const DEFAULTS = {
  headline: 'Subscribe now & get 20% off',
  subcopy:
    'Join our newsletter and be the first to know about exclusive offers, new arrivals, and seasonal collections.',
  cta: 'SUBSCRIBE',
  successText: '✅ Thanks for subscribing!',
  genericError: '❌ Something went wrong. Please try again.',
  invalidError: '⚠️ Please enter a valid email address.',
  requiredError: '❌ Email is required.',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterBox = ({
  onSubscribe,
  headline = DEFAULTS.headline,
  subcopy = DEFAULTS.subcopy,
  cta = DEFAULTS.cta,
  successText = DEFAULTS.successText,
  invalidError = DEFAULTS.invalidError,
  requiredError = DEFAULTS.requiredError,
  genericError = DEFAULTS.genericError,
  className = '',
}) => {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');     // string
  const [isError, setIsError] = useState(false);  // style flag
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Bot traps: honeypot + time on page
  const [hp, setHp] = useState('');                  // should stay empty
  const pageLoadTs = useRef(Date.now());
  const minHumanMs = 2000; // must spend at least 2s before submit

  // Derived validity
  const normalized = email.trim();
  const looksValid = useMemo(() => emailRegex.test(normalized), [normalized]);

  // Motion variants (subtle)
  const container = reduce ? {} : {
    hidden: { opacity: 0, y: 12 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.08 } },
  };
  const item = reduce ? {} : {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  // Live validation feedback when user has interacted
  useEffect(() => {
    if (!touched) return;
    if (!normalized) {
      setIsError(true);
      setMessage(requiredError);
    } else if (!looksValid) {
      setIsError(true);
      setMessage(invalidError);
    } else {
      setIsError(false);
      setMessage('');
    }
  }, [normalized, looksValid, touched, requiredError, invalidError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    // Basic checks
    if (!normalized) {
      setIsError(true);
      setMessage(requiredError);
      return;
    }
    if (!looksValid) {
      setIsError(true);
      setMessage(invalidError);
      return;
    }

    // Bot checks
    const elapsed = Date.now() - pageLoadTs.current;
    if (hp.trim() !== '' || elapsed < minHumanMs) {
      // Silently succeed to avoid clueing in bots
      setIsError(false);
      setMessage(successText);
      setEmail('');
      return;
    }

    try {
      setSubmitting(true);
      setMessage(''); // reset so aria-live announces the new state
      if (typeof onSubscribe === 'function') {
        await onSubscribe(normalized);
      } else {
        // Fallback demo
        await new Promise((r) => setTimeout(r, 400));
      }
      setIsError(false);
      setMessage(successText);
      setEmail('');
    } catch (err) {
      setIsError(true);
      setMessage(genericError);
    } finally {
      setSubmitting(false);
    }
  };

  const messageId = 'newsletter-feedback';

  return (
    <motion.div
      className={`text-center px-4 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={container}
    >
      <motion.p variants={item} className="text-2xl font-medium text-gray-900">
        {headline}
      </motion.p>

      <motion.p variants={item} className="text-gray-600 mt-3 text-sm sm:text-base max-w-xl mx-auto">
        {subcopy}
      </motion.p>

      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 flex items-stretch gap-3 mx-auto my-6 border rounded-lg pl-3 bg-white"
        aria-describedby={message ? messageId : undefined}
        aria-busy={submitting || undefined}
        role="form"
      >
        {/* visible email field */}
        <input
          className="w-full py-3 px-2 outline-none text-sm rounded-l-lg"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          required
          aria-label="Email address"
          aria-invalid={isError || undefined}
          disabled={submitting}
          autoComplete="email"
          inputMode="email"
        />

        {/* honeypot + timing (hidden from users, visible to bots) */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="newsletter-website">Website</label>
          <input
            id="newsletter-website"
            name="website"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <motion.button
          type="submit"
          className="bg-black text-white text-xs font-medium px-6 py-3 rounded-r-lg hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          disabled={submitting || !looksValid}
          whileHover={reduce ? {} : { scale: submitting ? 1 : 1.03 }}
          whileTap={reduce ? {} : { scale: submitting ? 1 : 0.97 }}
          aria-label="Subscribe to newsletter"
        >
          {submitting ? 'Submitting…' : cta}
          <span aria-hidden="true" className="nlb-ripple" />
        </motion.button>
      </motion.form>

      <motion.p
        id={messageId}
        role="status"
        aria-live="polite"
        variants={item}
        className={`min-h-[1.25rem] text-sm mt-2 nlb-status ${
          message ? (isError ? 'text-red-500' : 'text-green-600') : 'text-transparent'
        }`}
      >
        {message || 'placeholder'}
      </motion.p>

      {/* tiny privacy note (optional; remove if not desired) */}
      <motion.p
        variants={item}
        className="mt-2 text-[11px] text-gray-400"
      >
        We respect your privacy. Unsubscribe anytime.
      </motion.p>
    </motion.div>
  );
};

export default memo(NewsletterBox);
