// src/Pages/Contact.jsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from '../Components/Title';

const SUPPORT_EMAIL = 'info@ruthstore.et';
const SUPPORT_PHONE_DISPLAY = '+251 989 853 281';
const SUPPORT_PHONE_TEL = '+251 989 853 281';
const MESSAGE_MAX = 1000;

const Contact = () => {
  const { user } = useContext(ShopContext);
  const reduce = useReducedMotion();

  const [form, setForm] = useState({
    name: '',
    email: '',
    order: '',
    topic: '',
    message: '',
    website: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.email || user?.name) {
      setForm((f) => ({
        ...f,
        email: user.email || f.email,
        name: user.name || f.name,
      }));
    }
  }, [user]);

  const emailOk = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validate = (draft = form) => {
    const next = {};

    if (!draft.name.trim()) next.name = 'Please enter your full name.';

    if (!draft.email.trim()) next.email = 'Please enter your email address.';
    else if (!emailOk(draft.email)) next.email = 'That email does not look right.';

    const messageLength = draft.message.trim().length;

    if (!messageLength || messageLength < 10) {
      next.message = 'Please add at least 10 characters so we can help.';
    }

    if (messageLength > MESSAGE_MAX) {
      next.message = `Please shorten your message to ${MESSAGE_MAX} characters.`;
    }

    if (draft.website.trim()) next.website = 'Spam detected.';

    return next;
  };

  const onChange = (e) => {
    const { id, value } = e.target;

    setForm((current) => {
      const next = { ...current, [id]: value };

      if (errors[id]) {
        const recheck = validate(next);
        setErrors((previous) => ({
          ...previous,
          [id]: recheck[id],
        }));
      }

      return next;
    });

    setSubmitted(false);
  };

  const messageLen = form.message.trim().length;
  const messageTooLong = messageLen > MESSAGE_MAX;

  const isValid = useMemo(() => Object.keys(validate()).length === 0, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setSending(true);

    const subject = [
      'Ruth Store Inquiry',
      form.topic || 'General Question',
      form.order ? `Reference: ${form.order}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const lines = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.order ? `Reference / Item: ${form.order}` : null,
      form.topic ? `Topic: ${form.topic}` : null,
      '',
      'Message:',
      form.message.trim(),
      '',
      '---',
      'Sent from Ruth Store Ethiopia website',
    ]
      .filter(Boolean)
      .join('\n');

    const mailto = `mailto:${encodeURIComponent(
      SUPPORT_EMAIL
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;

    window.location.href = mailto;

    setSubmitted(true);
    setSending(false);

    setForm({
      name: user?.name || '',
      email: user?.email || '',
      order: '',
      topic: '',
      message: '',
      website: '',
    });
  };

  const section = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      };

  const cards = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, staggerChildren: 0.08 },
        },
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
      aria-labelledby="contact-heading"
    >
      <Title
        as="h1"
        id="contact-heading"
        eyebrow="CONTACT US"
        text1="Get In"
        text2="Touch"
        subtitle={
          <>
            Questions about our products or store? Contact Ruth Store by email at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-blue-600 underline cnt-link">
              {SUPPORT_EMAIL}
            </a>{' '}
            or call{' '}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-blue-600 underline cnt-link">
              {SUPPORT_PHONE_DISPLAY}
            </a>
            .
          </>
        }
        align="center"
        highlightClassName="text-black"
        className="mb-8"
      />

      <motion.section
        className="grid sm:grid-cols-3 gap-4 mb-10"
        variants={cards}
        aria-label="Contact options"
      >
        {[
          {
            label: 'Call us',
            value: SUPPORT_PHONE_DISPLAY,
            href: `tel:${SUPPORT_PHONE_TEL}`,
            note: 'Mon-Sat · 9am-7pm',
          },
          {
            label: 'Email',
            value: SUPPORT_EMAIL,
            href: `mailto:${SUPPORT_EMAIL}`,
            note: 'Typical reply in 1-2 business days',
          },
          {
            label: 'Location',
            value: 'Addis Ababa, Ethiopia',
            href: null,
            note: 'Visit our showroom',
          },
        ].map(({ label, value, href, note }) => (
          <motion.div
            key={label}
            className="bg-white rounded-xl border border-gray-200 p-5 text-center cnt-card shadow-sm hover:shadow-md transition"
            variants={cardItem}
            whileHover={reduce ? undefined : 'hover'}
          >
            <p className="text-sm text-gray-500">{label}</p>

            {href ? (
              <a
                href={href}
                className="text-lg font-semibold text-gray-900 break-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded"
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

      <AnimateStatus submitted={submitted} />

      <motion.form onSubmit={handleSubmit} className="grid gap-6" noValidate variants={section}>
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            value={form.website}
            onChange={onChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name <span className="text-red-600">*</span>
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={onChange}
              placeholder="Your full name"
              className={`mt-1 w-full border rounded px-4 py-2 cnt-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />

            {errors.name && (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email <span className="text-red-600">*</span>
            </label>

            <input
              id="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              className={`mt-1 w-full border rounded px-4 py-2 cnt-input focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
              inputMode="email"
            />

            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium">
              Product / Item <span className="text-gray-400">(optional)</span>
            </label>

            <input
              id="order"
              type="text"
              value={form.order}
              onChange={onChange}
              placeholder="e.g., handbag, candle, gift set"
              className="mt-1 w-full border rounded px-4 py-2 border-gray-300 cnt-input"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium">
              Topic <span className="text-gray-400">(optional)</span>
            </label>

            <select
              id="topic"
              value={form.topic}
              onChange={onChange}
              className="mt-1 w-full border rounded px-4 py-2 border-gray-300 cnt-select focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a topic...</option>
              <option>General Question</option>
              <option>Product Inquiry</option>
              <option>Reserve Item</option>
              <option>Visit Store</option>
              <option>Store Feedback</option>
              <option>Website Help</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            Message <span className="text-red-600">*</span>
          </label>

          <textarea
            id="message"
            rows={6}
            value={form.message}
            onChange={onChange}
            placeholder="Tell us how we can help you..."
            className={`mt-1 w-full border rounded px-4 py-2 cnt-textarea focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message || messageTooLong ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.message || messageTooLong}
            aria-describedby={errors.message || messageTooLong ? 'message-error' : 'message-help'}
            maxLength={MESSAGE_MAX + 200}
            autoComplete="off"
          />

          <div className="flex items-center justify-between mt-1">
            <p id="message-help" className="text-xs text-gray-500">
              Please include the product name, brand, or question if available.
            </p>

            <motion.span
              key={messageLen}
              className={`text-xs ${messageTooLong ? 'text-red-600' : 'text-gray-500'}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
            >
              {messageLen}/{MESSAGE_MAX}
            </motion.span>
          </div>

          {(errors.message || messageTooLong) && (
            <p id="message-error" className="mt-1 text-xs text-red-600">
              {errors.message || `Please shorten your message to ${MESSAGE_MAX} characters.`}
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={sending || !isValid}
          className={`bg-black text-white px-6 py-3 rounded transition w-full sm:w-auto relative overflow-hidden cnt-submit focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
            sending || !isValid ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
          aria-label="Contact Ruth Store"
          whileTap={reduce ? {} : { scale: 0.98 }}
        >
          {sending ? 'Preparing email...' : 'Contact Ruth Store'}
          <span aria-hidden="true" className="cnt-shine" />
        </motion.button>
      </motion.form>

      <motion.div className="mt-12 text-center text-gray-600 space-y-2" variants={section}>
        <p>
          Quick links:{' '}
          <Link to="/visit-store" className="text-blue-600 underline cnt-link">
            Visit Store
          </Link>{' '}
          ·{' '}
          <Link to="/brands" className="text-blue-600 underline cnt-link">
            Brands
          </Link>{' '}
          ·{' '}
          <Link to="/occasions" className="text-blue-600 underline cnt-link">
            Occasions
          </Link>
        </p>

        <p className="text-xs">
          Ruth Store is a browse-online and buy-in-store boutique experience.
        </p>
      </motion.div>
    </motion.main>
  );
};

const AnimateStatus = ({ submitted }) => {
  if (!submitted) return null;

  return (
    <motion.p
      className="text-green-600 font-medium text-center mb-6 cnt-status"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      ✅ Thank you for contacting Ruth Store. Your email application should open
      with your message ready to send.
    </motion.p>
  );
};

export default Contact;