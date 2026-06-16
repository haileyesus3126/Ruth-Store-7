// src/Pages/SearchResults.jsx
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../Components/ProductItem';
import Title from '../Components/Title';

const normalize = (v) => String(v ?? '').toLowerCase().trim();

const tokenize = (q) =>
  normalize(q)
    .split(/\s+/)
    .filter(Boolean);

const fieldText = (p) => ({
  name: normalize(p.name),
  description: normalize(p.description),
  category: normalize(p.category),
  sub: normalize(p.subCategory),
  brand: normalize(p.brand),
});

const scoreProduct = (p, tokens) => {
  if (!tokens.length) return 0;
  const t = fieldText(p);
  let score = 0;

  for (const tok of tokens) {
    // Name is the strongest signal
    if (t.name.startsWith(tok)) score += 6;
    else if (t.name.includes(tok)) score += 3;

    // Category / subcategory / brand are strong too
    if (t.category.startsWith(tok)) score += 3;
    else if (t.category.includes(tok)) score += 1.5;

    if (t.sub.startsWith(tok)) score += 3;
    else if (t.sub.includes(tok)) score += 1.5;

    if (t.brand.startsWith(tok)) score += 3;
    else if (t.brand.includes(tok)) score += 1.5;

    // Description is weaker signal
    if (t.description.includes(tok)) score += 0.8;
  }

  return score;
};

const SearchResults = () => {
  const { products = [] } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') || '';
  const [input, setInput] = useState(q);

  // Keep input in sync if URL changes externally
  useEffect(() => setInput(q), [q]);

  const tokens = useMemo(() => tokenize(q), [q]);

  const results = useMemo(() => {
    if (!tokens.length) return [];
    // Score then filter then sort
    const withScores = products.map((p) => ({
      p,
      s: scoreProduct(p, tokens),
    }));
    const filtered = withScores.filter((x) => x.s > 0);
    filtered.sort((a, b) => {
      if (b.s !== a.s) return b.s - a.s; // higher score first
      const an = String(a.p.name || '').toLowerCase();
      const bn = String(b.p.name || '').toLowerCase();
      return an.localeCompare(bn);
    });
    return filtered.map((x) => x.p);
  }, [products, tokens]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (input.trim()) next.set('q', input.trim());
    else next.delete('q');
    setSearchParams(next);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:px-16 my-12">
      {/* Header */}
      <div className="text-center mb-6">
        <Title text1="SEARCH" text2="RESULTS" />
        <p className="text-gray-600 text-sm mt-2">
          {q ? (
            <>
              Showing results for: <span className="font-semibold">“{q}”</span>
            </>
          ) : (
            <span className="italic">No search term provided.</span>
          )}
        </p>
      </div>

      {/* Refine search box */}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mb-8 flex items-center gap-2"
        role="search"
        aria-label="Refine search"
      >
        <input
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          type="search"
          placeholder="Search products, brands, categories..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white text-sm hover:bg-gray-800 transition"
        >
          Search
        </button>
      </form>

      {/* Result summary */}
      {tokens.length > 0 && (
        <p className="text-sm text-gray-600 mb-4 text-center">
          {results.length} result{results.length === 1 ? '' : 's'}
          {q && <> for <span className="font-semibold">“{q}”</span></>}
        </p>
      )}

      {/* Results grid / states */}
      {tokens.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Please enter a search term to see results.
        </p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((item) => (
            <ProductItem
              key={item._id || item.id}
              id={item._id || item.id}
              name={item.name}
              image={item.image}
              price={item.price}
              rating={item.rating}
              reviews={item.reviews}
              bestseller={item.bestseller}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No matching products found{q ? <> for “<span className="font-semibold">{q}</span>”</> : ''}.
        </p>
      )}
    </div>
  );
};

export default SearchResults;
