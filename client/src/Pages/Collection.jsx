// src/Pages/Collection.jsx
import React, { useContext, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../Components/ProductItem';
import Title from '../Components/Title';

const PRODUCTS_PER_PAGE = 12;

// Safe date → epoch ms (fallback 0 for missing/invalid)
const toTime = (d) => {
  if (!d) return 0;
  const t = new Date(d).getTime();
  return Number.isFinite(t) ? t : 0;
};

const Collection = () => {
  const { products = [], currency = '$' } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const reduce = useReducedMotion();

  // URL params (source of truth)
  const category = searchParams.get('category') || '';
  const subCategory = searchParams.get('sub') || '';
  const price = searchParams.get('price') || '';
  const sort = searchParams.get('sort') || '';
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const filter = searchParams.get('filter') || '';
  const type = searchParams.get('type') || '';
  const brandName = searchParams.get('name') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Facet lists
  const allCategories = useMemo(
    () =>
      [...new Set(products.map((p) => p.category).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { sensitivity: 'base' })
      ),
    [products]
  );

  const allSubCategories = useMemo(
    () =>
      [...new Set(products.map((p) => p.subCategory).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { sensitivity: 'base' })
      ),
    [products]
  );

  // Filtering + sorting pipeline
  const filtered = useMemo(() => {
    let list = products;

    // Free-text search
    if (q) {
      list = list.filter((p) =>
        [p.name, p.description].filter(Boolean).some((txt) => String(txt).toLowerCase().includes(q))
      );
    }

    // Deep-link: brand
    if (type === 'brand' && brandName) {
      list = list.filter(
        (p) => String(p.brand || '').toLowerCase() === String(brandName).toLowerCase()
      );
    }

    // Deep-link: bestseller/new
    if (filter === 'bestseller') {
      list = list.filter((p) => !!p.bestseller);
    }
    // filter === 'new' handled by sort (newest first)

    // Facets
    if (category) list = list.filter((p) => p.category === category);
    if (subCategory) list = list.filter((p) => p.subCategory === subCategory);

    // Price band
    if (price) {
      list = list.filter((p) => {
        const v = Number(p.price) || 0;
        switch (price) {
          case 'under25':
            return v < 25;
          case '25to50':
            return v >= 25 && v <= 50;
          case '50to100':
            return v > 50 && v <= 100;
          case 'over100':
            return v > 100;
          default:
            return true;
        }
      });
    }

    // Sorting (copy first)
    const arr = [...list];
    if (sort === 'priceLowToHigh') arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sort === 'priceHighToLow')
      arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else if (sort === 'newest' || filter === 'new') arr.sort((a, b) => toTime(b.date) - toTime(a.date));
    // else keep insertion order

    return arr;
  }, [products, q, type, brandName, filter, category, subCategory, price, sort]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * PRODUCTS_PER_PAGE;
  const pageItems = filtered.slice(start, start + PRODUCTS_PER_PAGE);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pageSafe]);

  // Keep URL in sync if user requests a page beyond the max
  useEffect(() => {
    if (page !== pageSafe) {
      const next = new URLSearchParams(searchParams);
      next.set('page', String(pageSafe));
      setSearchParams(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSafe]);

  // Helper to set one param and reset page (except when changing page)
  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());

  /* ---------- motion presets (subtle, respect reduced motion) ---------- */
  const section = reduce ? {} : {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  const filtersRow = reduce ? {} : {
    hidden: { opacity: 0, y: 8 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.05 } },
  };
  const filterItem = reduce ? {} : {
    hidden: { opacity: 0, y: 6 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };
  const gridStagger = reduce ? {} : {
    hidden: { opacity: 0, y: 10 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', staggerChildren: 0.06, when: 'beforeChildren' } },
  };
  const card = reduce ? {} : {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35 } },
    exit:   { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.25 } },
    hover:  { y: -3, scale: 1.02 },
    tap:    { scale: 0.99 },
  };

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-8 lg:px-16 my-12"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={section}
    >
      <div className="text-center mb-6">
        <Title text1="OUR" text2="COLLECTION" />
        <motion.p
          className="text-gray-600 text-sm mt-2 coll-info"
          key={q || 'all'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {q ? (
            <>
              Showing results for <span className="font-semibold">“{q}”</span>
            </>
          ) : (
            'Explore our products'
          )}
        </motion.p>
      </div>

      {/* Filters row */}
      <motion.div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4" variants={filtersRow}>
        {/* Category */}
        <motion.div variants={filterItem}>
          <label htmlFor="filter-category" className="sr-only">Category</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => setParam('category', e.target.value)}
            className="border rounded px-4 py-2 w-full coll-select"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Subcategory */}
        <motion.div variants={filterItem}>
          <label htmlFor="filter-subcategory" className="sr-only">Subcategory</label>
          <select
            id="filter-subcategory"
            value={subCategory}
            onChange={(e) => setParam('sub', e.target.value)}
            className="border rounded px-4 py-2 w-full coll-select"
            aria-label="Filter by subcategory"
          >
            <option value="">All Subcategories</option>
            {allSubCategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Price */}
        <motion.div variants={filterItem}>
          <label htmlFor="filter-price" className="sr-only">Price range</label>
          <select
            id="filter-price"
            value={price}
            onChange={(e) => setParam('price', e.target.value)}
            className="border rounded px-4 py-2 w-full coll-select"
            aria-label="Filter by price"
          >
            <option value="">All Prices</option>
            <option value="under25">Under {currency}25</option>
            <option value="25to50">{currency}25 - {currency}50</option>
            <option value="50to100">{currency}50 - {currency}100</option>
            <option value="over100">Over {currency}100</option>
          </select>
        </motion.div>

        {/* Sort */}
        <motion.div variants={filterItem}>
          <label htmlFor="filter-sort" className="sr-only">Sort by</label>
          <select
            id="filter-sort"
            value={sort}
            onChange={(e) => setParam('sort', e.target.value)}
            className="border rounded px-4 py-2 w-full coll-select"
            aria-label="Sort products"
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Active filters info + Clear all */}
      {(category || subCategory || price || sort || q || filter || (type === 'brand' && brandName)) && (
        <motion.div
          className="flex flex-wrap items-center gap-2 mb-6 coll-active"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-sm text-gray-600">
            {filtered.length} product{filtered.length === 1 ? '' : 's'} found
          </span>
          <button className="text-sm underline text-gray-700 hover:text-black" onClick={clearAll}>
            Clear all
          </button>
        </motion.div>
      )}

      {/* Products grid */}
      <AnimatePresence mode="popLayout">
        {pageItems.length > 0 ? (
          <motion.section
            key={`page-${pageSafe}-${pageItems.length}`}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={gridStagger}
          >
            {pageItems.map((p) => (
              <motion.div
                key={p._id || p.id}
                variants={card}
                whileHover="hover"
                whileTap="tap"
                layout
                className="group"
              >
                <ProductItem
                  id={p._id || p.id}
                  name={p.name}
                  image={p.image}
                  price={p.price}
                  bestseller={!!p.bestseller}
                  rating={p.rating}
                  reviews={p.reviews}
                />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <motion.p
            key="empty"
            className="text-center text-gray-500 mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No matching products found.
          </motion.p>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center gap-2 mt-10 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 coll-page"
            onClick={() => setParam('page', String(pageSafe - 1))}
            disabled={pageSafe <= 1}
            whileTap={reduce ? {} : { scale: 0.96 }}
          >
            Prev
          </motion.button>

          {Array.from({ length: totalPages }, (_, i) => {
            const n = i + 1;
            const isActive = n === pageSafe;
            return (
              <motion.button
                key={n}
                onClick={() => setParam('page', String(n))}
                className={`px-4 py-2 rounded ${isActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} coll-page`}
                aria-current={isActive ? 'page' : undefined}
                whileTap={reduce ? {} : { scale: 0.96 }}
                whileHover={reduce ? {} : { y: -1 }}
              >
                {n}
              </motion.button>
            );
          })}

          <motion.button
            className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 coll-page"
            onClick={() => setParam('page', String(pageSafe + 1))}
            disabled={pageSafe >= totalPages}
            whileTap={reduce ? {} : { scale: 0.96 }}
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Collection;
