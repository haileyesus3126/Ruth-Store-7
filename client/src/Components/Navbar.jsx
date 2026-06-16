// src/Components/Navbar.jsx
import React, { useState, useEffect, useContext, useRef, useMemo, memo } from 'react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import CategoriesMegaMenu from './CategoriesMegaMenu';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, cartItems } = useContext(ShopContext);

  const [language, setLanguage] = useState('en');

  const text = {
    en: {
      home: 'Home',
      shop: 'Shop',
      brands: 'Brands',
      occasions: 'Occasions',
      visitStore: 'Visit Store',
      about: 'About',
      contact: 'Contact',
      allCategories: 'All Categories',
      search: 'Search gifts, brands, occasions...',
      login: 'Login',
      signIn: 'Sign In',
      profile: 'My Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      logout: 'Logout',
      signedIn: 'Signed in as',
    },
    am: {
      home: 'መነሻ',
      shop: 'ሱቅ',
      brands: 'ብራንዶች',
      occasions: 'ዝግጅቶች',
      visitStore: 'ሱቃችንን ይጎብኙ',
      about: 'ስለ እኛ',
      contact: 'አግኙን',
      allCategories: 'ሁሉም ምድቦች',
      search: 'ስጦታ፣ ብራንድ ወይም ዝግጅት ይፈልጉ...',
      login: 'ግባ',
      signIn: 'ግባ',
      profile: 'የእኔ መገለጫ',
      orders: 'ትዕዛዞች',
      wishlist: 'የተወደዱ',
      logout: 'ውጣ',
      signedIn: 'ገብተዋል',
    },
  };

  const t = text[language];

  const cartCount = useMemo(
    () => Object.values(cartItems || {}).reduce((acc, qty) => acc + qty, 0),
    [cartItems]
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const drawerRef = useRef(null);
  const headerRef = useRef(null);
  const menuBtnRef = useRef(null);
  const drawerCloseRef = useRef(null);

  const accountMenuId = 'account-menu';

  useEffect(() => {
    const measure = () => setHeaderHeight(headerRef.current?.offsetHeight || 0);
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, [scrolled, language]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = mobileMenuVisible ? 'hidden' : prev;

    if (!dropdownOpen) {
      return () => {
        document.body.style.overflow = prev;
      };
    }

    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.body.style.overflow = prev;
    };
  }, [mobileMenuVisible, dropdownOpen]);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuVisible(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuVisible(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileMenuVisible || !drawerRef.current) return;

    const focusable =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const nodes = Array.from(drawerRef.current.querySelectorAll(focusable));
    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    (drawerCloseRef.current || first)?.focus();

    const onKeydown = (e) => {
      if (e.key !== 'Tab' || nodes.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [mobileMenuVisible]);

  useEffect(() => {
    if (!mobileMenuVisible && menuBtnRef.current) {
      const timer = setTimeout(() => menuBtnRef.current?.focus(), 0);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuVisible]);

  const navItems = [
    { path: '/', label: t.home },
    { path: '/collection', label: t.shop },
    { path: '/brands', label: t.brands },
    { path: '/occasions', label: t.occasions },
    { path: '/visit-store', label: t.visitStore },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ];

  const submitSearch = (e) => {
    e.preventDefault();

    const q = searchTerm.trim();
    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchTerm('');
    setMobileMenuVisible(false);
  };

  const headerChrome = `fixed top-0 inset-x-0 z-50 bg-white transition-all duration-300 ${
    scrolled ? 'border-b border-gray-200 shadow-sm' : 'border-b border-gray-100'
  }`;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header ref={headerRef} className={headerChrome}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <Link to="/" aria-label="Go to homepage" className="shrink-0">
              <img
                src={assets.logo}
                className="w-44 transition-all duration-300"
                alt="Ruth Store logo"
              />
            </Link>

            <nav
              className="hidden lg:flex items-center gap-6 text-lg font-semibold text-gray-800"
              aria-label="Primary"
            >
              {navItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `relative whitespace-nowrap hover:text-black transition pb-1 ${
                      isActive
                        ? 'text-black after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-full after:bg-black'
                        : ''
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center border border-gray-300 rounded-full overflow-hidden text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 ${
                    language === 'en' ? 'bg-black text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  EN
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`px-3 py-1 ${
                    language === 'am' ? 'bg-black text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  አማ
                </button>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={dropdownOpen}
                  aria-controls={accountMenuId}
                  className="p-1 rounded hover:bg-gray-100 transition"
                  aria-label="Account menu"
                >
                  <img src={assets.profile_icon} className="w-6" alt="" aria-hidden="true" />
                </button>

                {dropdownOpen && (
                  <div
                    id={accountMenuId}
                    className="absolute right-0 top-10 bg-white border shadow-lg rounded-md p-4 z-50 w-52 text-sm"
                    role="menu"
                    aria-label="Account"
                  >
                    {user ? (
                      <>
                        <p className="mb-2 text-gray-600 truncate">👤 {user.email}</p>

                        <Link to="/profile" role="menuitem" className="block hover:text-black mb-2">
                          {t.profile}
                        </Link>

                        <Link to="/orders" role="menuitem" className="block hover:text-black mb-2">
                          {t.orders}
                        </Link>

                        <Link to="/wishlist" role="menuitem" className="block hover:text-black mb-2">
                          {t.wishlist}
                        </Link>

                       {user?.role === "admin" && (
  <>
    <hr className="my-2" />

    <Link
      to="/admin/products"
      role="menuitem"
      className="block hover:text-black mb-2"
    >
      Manage Products
    </Link>

    <Link
      to="/admin/products/new"
      role="menuitem"
      className="block hover:text-black mb-2"
    >
      Add Product
    </Link>

    <Link
      to="/admin/orders"
      role="menuitem"
      className="block hover:text-black mb-2"
    >
      Manage Orders
    </Link>
  </>
)}

                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          {t.logout}
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        role="menuitem"
                        className="block text-gray-700 hover:text-black"
                      >
                        {t.login}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/cart"
                className="relative"
                aria-label={`Cart${cartCount ? ` with ${cartCount} items` : ''}`}
              >
                <img src={assets.cart_icon} className="w-5" alt="" aria-hidden="true" />

                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -right-1 -bottom-1 w-4 h-4 bg-black text-white text-[10px] font-semibold leading-4 text-center rounded-full badge-pop"
                    aria-hidden="true"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                ref={menuBtnRef}
                onClick={() => setMobileMenuVisible(true)}
                className="lg:hidden p-1 rounded hover:bg-gray-100"
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuVisible}
              >
                <img src={assets.menu_icon} className="w-5" alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-between gap-6 border-t border-gray-100 py-3">
            <div className="shrink-0 text-lg font-semibold text-gray-900">
              <CategoriesMegaMenu label={t.allCategories} />
            </div>

            <form
              onSubmit={submitSearch}
              className="relative flex-1 max-w-2xl"
              role="search"
              aria-label="Site search"
            >
              <label htmlFor="navbar-search" className="sr-only">
                Search
              </label>

              <input
                id="navbar-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.search}
                className="w-full border border-gray-300 px-5 py-3 pr-12 rounded-full text-sm bg-white outline-none focus:outline-none focus:ring-0 focus:border-gray-500 transition"
              />

              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Submit search"
              >
                <img src={assets.search_icon} className="w-5" alt="" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {mobileMenuVisible && (
        <>
          <button
            aria-label="Close menu"
            onClick={() => setMobileMenuVisible(false)}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            tabIndex={-1}
          />

          <div
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-50 lg:hidden transform transition-transform duration-300 ease-out translate-y-0"
          >
            <div className="flex h-full flex-col bg-white">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <Link to="/" onClick={() => setMobileMenuVisible(false)}>
                  <img src={assets.logo} alt="Ruth Store" className="h-12" />
                </Link>

                <button
                  ref={drawerCloseRef}
                  onClick={() => setMobileMenuVisible(false)}
                  className="p-2 rounded"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 px-4 py-3 border-b">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    language === 'en' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  English
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('am')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    language === 'am' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  አማርኛ
                </button>
              </div>

              <form onSubmit={submitSearch} role="search" className="px-4 py-4">
                <label htmlFor="navbar-search-mobile" className="sr-only">
                  Search
                </label>

                <div className="relative">
                  <input
                    id="navbar-search-mobile"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.search}
                    className="w-full rounded-full border border-gray-300 px-4 py-3 pr-12 text-base outline-none focus:outline-none focus:ring-0 focus:border-gray-500"
                  />

                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    aria-label="Submit search"
                  >
                    <img src={assets.search_icon} className="w-5" alt="" />
                  </button>
                </div>
              </form>

              <nav aria-label="Mobile primary" className="px-2 py-2 space-y-2 overflow-y-auto">
                <NavLink
                  to="/collection"
                  onClick={() => setMobileMenuVisible(false)}
                  className="block rounded-lg px-4 py-3 text-lg font-semibold bg-gray-100 hover:bg-gray-200"
                >
                  {t.allCategories}
                </NavLink>

                {navItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuVisible(false)}
                    className="block rounded-lg px-4 py-3 text-lg font-medium bg-gray-50 hover:bg-gray-100"
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto px-4 py-4 border-t">
                {user ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-600 truncate">
                      {t.signedIn} {user.email}
                    </span>

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuVisible(false);
                      }}
                      className="text-sm font-semibold underline"
                    >
                      {t.logout}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuVisible(false)}
                    className="inline-block rounded-md bg-black text-white px-4 py-2 text-sm font-semibold"
                  >
                    {t.signIn}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div style={{ height: headerHeight }} aria-hidden="true" />
    </>
  );
};

export default memo(Navbar);