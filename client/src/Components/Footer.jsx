// src/Components/Footer.jsx
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const companyLinks = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Shop' },
  { to: '/brands', label: 'Brands' },
  { to: '/occasions', label: 'Occasions' },
  { to: '/visit-store', label: 'Visit Store' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Open Facebook',
    Icon: FaFacebook,
  },
  {
    href: 'https://instagram.com',
    label: 'Open Instagram',
    Icon: FaInstagram,
  },
  {
    href: 'https://tiktok.com',
    label: 'Open TikTok',
    Icon: FaTiktok,
  },
];

const PHONE_DISPLAY = '+251 989 853 281';
const PHONE_TEL = '+251 989 853 281';
const EMAIL = 'info@ruthstore.et';
const LOCATION = 'Addis Ababa, Ethiopia';

const Footer = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className="mt-20 border-t border-gray-200 bg-white px-6"
      aria-labelledby="site-footer-title"
    >
      <h2 id="site-footer-title" className="sr-only">
        Site footer
      </h2>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 py-14 text-center text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
        {/* Brand */}
        <div>
          <Link to="/" aria-label="Go to Ruth Store homepage">
            <img
              src={assets.logo}
              alt="Ruth Store logo"
              className="mx-auto mb-5 w-36 lg:mx-0"
              loading="lazy"
              decoding="async"
            />
          </Link>

          <p className="mx-auto max-w-xs leading-7 lg:mx-0">
            Ruth Store Ethiopia offers premium gifts, home décor, handbags,
            stationery, faith-inspired products, and meaningful keepsakes for
            life&apos;s special moments.
          </p>

          <p className="mt-4 text-sm font-semibold text-[#0F172A]">
            Browse online. Visit our store. Buy in person.
          </p>
        </div>

        {/* Quick Links */}
        <nav aria-labelledby="footer-links-title">
          <h3
            id="footer-links-title"
            className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#0F172A]"
          >
            Quick Links
          </h3>

          <ul className="flex flex-col gap-3">
            {companyLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="transition hover:text-[#D4AF37] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Store Info */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#0F172A]">
            Visit Our Store
          </h3>

          <address className="not-italic space-y-4">
            <p className="flex items-center justify-center gap-3 lg:justify-start">
              <FaMapMarkerAlt className="text-[#D4AF37]" aria-hidden="true" />
              <span>{LOCATION}</span>
            </p>

            <p className="flex items-center justify-center gap-3 lg:justify-start">
              <FaPhoneAlt className="text-[#D4AF37]" aria-hidden="true" />
              <a
                href={`tel:${PHONE_TEL}`}
                className="transition hover:text-[#D4AF37] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              >
                {PHONE_DISPLAY}
              </a>
            </p>

            <p className="flex items-center justify-center gap-3 lg:justify-start">
              <FaEnvelope className="text-[#D4AF37]" aria-hidden="true" />
              <a
                href={`mailto:${EMAIL}`}
                className="break-all transition hover:text-[#D4AF37] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              >
                {EMAIL}
              </a>
            </p>
          </address>

           
        </div>

        {/* Social */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#0F172A]">
            Follow Us
          </h3>

          <p className="mx-auto mb-5 max-w-xs leading-7 lg:mx-0">
            Follow Ruth Store for new arrivals, gift ideas, boutique displays,
            and special occasion collections.
          </p>

          <nav aria-labelledby="footer-social-title">
            <h3 id="footer-social-title" className="sr-only">
              Social media
            </h3>

            <ul className="flex justify-center gap-4 text-lg text-[#0F172A] lg:justify-start">
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0F172A] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-gray-200 py-6 text-center">
        <p className="mb-2 text-sm italic text-gray-500">
          Meaningful Gifts For Every Occasion
        </p>

        <p className="text-sm text-gray-600">
          © {year}{' '}
          <span className="font-semibold text-[#0F172A]">
            Ruth Store Ethiopia
          </span>{' '}
          — All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default memo(Footer);