// src/Components/CategoriesMegaMenu.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLUMNS = [
  {
    title: 'Gifts & Occasions',
    items: [
      { label: 'Birthday Gifts' },
      { label: 'Wedding Gifts' },
      { label: 'Graduation Gifts' },
      { label: 'Baby Shower Gifts' },
      { label: "Mother's Day Gifts" },
      { label: 'Holiday Gifts' },
    ],
  },
  {
    title: 'For Her',
    items: [
      { label: 'Handbags' },
      { label: 'Jewelry & Accessories' },
      { label: 'Fragrances' },
      { label: 'Fashion Accessories' },
      { label: 'Self-Care Gifts' },
    ],
  },
  {
    title: 'Home & Living',
    items: [
      { label: 'Home Décor' },
      { label: 'Candles' },
      { label: 'Kitchen & Dining' },
      { label: 'Wall Art' },
      { label: 'Seasonal Décor' },
    ],
  },
  {
    title: 'Baby & Kids',
    items: [
      { label: 'Plush Toys' },
      { label: 'Baby Gifts' },
      { label: 'Kids Gifts' },
      { label: 'Learning Toys' },
    ],
  },
  {
    title: 'Faith & Inspiration',
    items: [
      { label: 'Devotionals' },
      { label: 'Inspirational Gifts' },
      { label: 'Faith Jewelry' },
      { label: 'Christian Cards' },
    ],
  },
  {
    title: 'Gourmet & Treats',
    items: [
      { label: 'Chocolates' },
      { label: 'Specialty Snacks' },
      { label: 'Tea & Coffee Gifts' },
      { label: 'Gift Baskets' },
    ],
  },
  {
    title: 'Books & Stationery',
    items: [
      { label: 'Journals' },
      { label: 'Planners' },
      { label: 'Greeting Cards' },
      { label: 'Gift Wrap' },
     
    ],
  },
  {
    title: 'Visit Our Store',
    items: [
      { label: 'New Arrivals' },
      { label: 'Best Sellers' },
      { label: 'Available In Store' },
      { label: 'Reserve Item' },
    ],
  },
];

const CategoriesMegaMenu = ({ label = 'All Categories' }) => {
  const [open, setOpen] = useState(false);

  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const hoverOpenDelay = useRef(null);
  const hoverCloseDelay = useRef(null);

  const navigate = useNavigate();

  const openWithDelay = () => {
    clearTimeout(hoverCloseDelay.current);
    hoverOpenDelay.current = setTimeout(() => setOpen(true), 120);
  };

  const closeWithDelay = () => {
    clearTimeout(hoverOpenDelay.current);
    hoverCloseDelay.current = setTimeout(() => setOpen(false), 220);
  };

  const closeMenu = () => {
    clearTimeout(hoverOpenDelay.current);
    clearTimeout(hoverCloseDelay.current);
    setOpen(false);
  };

  const goToCategory = (categoryLabel, subLabel) => {
    const params = new URLSearchParams();

    params.set('type', 'category');
    params.set('name', categoryLabel);

    if (subLabel) {
      params.set('sub', subLabel);
    }

    navigate(`/collection?${params.toString()}`);
    closeMenu();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!open) return;

      const trigger = triggerRef.current;
      const panel = panelRef.current;

      if (trigger?.contains(e.target)) return;
      if (panel?.contains(e.target)) return;

      closeMenu();
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      clearTimeout(hoverOpenDelay.current);
      clearTimeout(hoverCloseDelay.current);
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={openWithDelay}
      onMouseLeave={closeWithDelay}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition
          ${
            open
              ? 'bg-[#0F172A] text-white'
              : 'bg-[#F8FAFC] text-[#0F172A] hover:bg-[#0F172A] hover:text-white'
          }`}
      >
        <span>{label}</span>

        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label={label}
          tabIndex={-1}
          onMouseEnter={() => clearTimeout(hoverCloseDelay.current)}
          onMouseLeave={closeWithDelay}
          className="absolute left-0 top-[calc(100%+14px)] z-50 w-[min(94vw,1120px)] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2.4fr]">
            <div className="bg-[#0F172A] p-7 text-white">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                Ruth Store
              </p>

              <h3 className="mb-4 text-3xl font-serif leading-tight">
                Premium gifts for every meaningful moment.
              </h3>

              <p className="mb-6 text-sm leading-6 text-white/75">
                Browse our curated boutique categories, then visit our store to experience
                the collection in person.
              </p>

              <button
                type="button"
                onClick={() => goToCategory('Featured Collections', 'Available In Store')}
                className="rounded-full border border-[#D4AF37] px-5 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F172A]"
              >
                Available In Store
              </button>
            </div>

            <div className="p-7">
              <div className="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-3 xl:grid-cols-4">
                {COLUMNS.map((column) => (
                  <div key={column.title}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => goToCategory(column.title)}
                      className="mb-3 block text-left text-[15px] font-bold text-[#0F172A] transition hover:text-[#D4AF37]"
                    >
                      {column.title}
                    </button>

                    <ul className="space-y-2">
                      {column.items.map((item) => (
                        <li key={item.label}>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => goToCategory(column.title, item.label)}
                            className="text-left text-sm text-gray-600 transition hover:text-[#0F172A] hover:underline"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
                <p className="text-sm text-gray-500">
                  New products are updated regularly for Ruth Store Ethiopia.
                </p>

                <button
                  type="button"
                  onClick={() => goToCategory('Featured Collections', 'New Arrivals')}
                  className="text-sm font-semibold text-[#0F172A] underline-offset-4 hover:underline"
                >
                  View New Arrivals →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesMegaMenu;