// src/Components/ProductItem.jsx
import React, { useContext, useMemo, memo, useId, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";


const API_URL = import.meta.env.VITE_API_URL;

const getImageUrl = (image) => {
  if (!image) return "/fallback.png";

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  return image;
};

const Stars = memo(function Stars({ rating = 0, reviews = 0 }) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const label = `Rating: ${r} out of 5`;

  return (
    <div
      className="flex justify-center items-center gap-1 mt-1 pi-stars"
      aria-label={label}
    >
      {Array.from({ length: full }).map((_, index) => (
        <FaStar
          key={`f-${index}`}
          className="text-yellow-400 text-xs"
          aria-hidden="true"
        />
      ))}

      {half && (
        <FaStarHalfAlt
          className="text-yellow-400 text-xs"
          aria-hidden="true"
        />
      )}

      {Array.from({ length: empty }).map((_, index) => (
        <FaRegStar
          key={`e-${index}`}
          className="text-yellow-400 text-xs"
          aria-hidden="true"
        />
      ))}

      <span className="text-xs text-gray-500 ml-1">
        ({Number(reviews || 0).toLocaleString()})
      </span>
    </div>
  );
});

const ProductItem = ({
  id,
  image,
  images,
  name,
  price,
  bestseller = false,
  rating = 0,
  reviews = 0,
}) => {
  const navigate = useNavigate();

  const { currency, wishlist = [], toggleWishlist } = useContext(ShopContext);

  const prefersReduced = useReducedMotion();
  const titleId = useId();

  const imgSrc = useMemo(() => {
    const rawImage =
      Array.isArray(images) && images.length > 0
        ? images[0]
        : Array.isArray(image)
        ? image[0]
        : image;

    return getImageUrl(rawImage);
  }, [image, images]);

  const formattedPrice = useMemo(() => {
    const numberPrice = Number(price ?? 0);
    const safePrice = Number.isFinite(numberPrice) ? numberPrice : 0;

    return `${currency}${safePrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, [price, currency]);

  const inWishlist = useMemo(() => {
    const idString = String(id);

    return Array.isArray(wishlist) && wishlist.some((item) => String(item) === idString);
  }, [wishlist, id]);

  const onWishlist = useCallback(() => {
    toggleWishlist?.(id);
  }, [toggleWishlist, id]);

  const cardInitial = prefersReduced
    ? {}
    : {
        opacity: 0,
        y: 16,
        scale: 0.98,
      };

  const cardReveal = prefersReduced
    ? {}
    : {
        opacity: 1,
        y: 0,
        scale: 1,
      };

  const cardHover = prefersReduced
    ? {}
    : {
        y: -4,
        scale: 1.02,
        transition: {
          type: "spring",
          stiffness: 160,
          damping: 18,
        },
      };

  const cardTap = prefersReduced
    ? {}
    : {
        scale: 0.99,
      };

  return (
    <motion.article
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 pi-card transition-all duration-300 overflow-hidden group focus-within:ring-2 focus-within:ring-black/10"
      initial={cardInitial}
      whileInView={cardReveal}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
      whileTap={cardTap}
      aria-labelledby={titleId}
    >
      {bestseller && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded pi-badge shadow-sm z-10">
          Best Seller
        </div>
      )}

      <Link to={`/product/${id}`} aria-label={`View details for ${name}`}>
        <div className="w-full aspect-[3/4] bg-[#f8f8f8] flex items-center justify-center p-3 pi-img">
          <motion.img
            src={imgSrc}
            alt={`${name} product image`}
            loading="lazy"
            width={600}
            height={800}
            onError={(event) => {
              event.currentTarget.src = "/fallback.png";
            }}
            className="max-h-full max-w-full object-contain select-none"
            whileHover={prefersReduced ? {} : { scale: 1.06 }}
            transition={{ duration: 0.25 }}
            draggable="false"
          />
        </div>
      </Link>

      <div className="p-4 text-center">
        <Link
          to={`/product/${id}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15 rounded"
        >
          <p
            id={titleId}
            className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2"
            title={name}
          >
            {name}
          </p>
        </Link>

        <p className="text-base font-semibold text-black mt-1">
          {formattedPrice}
        </p>

        <Stars rating={rating} reviews={reviews} />

        <div className="flex justify-center gap-2 mt-4">
          <motion.button
            type="button"
            aria-pressed={inWishlist}
            aria-label={
              inWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
            className={`text-xs px-3 py-1 rounded border transition pi-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15 ${
              inWishlist
                ? "bg-gray-100 border-gray-300"
                : "border-gray-300 hover:bg-gray-100"
            }`}
            onClick={onWishlist}
            whileHover={prefersReduced ? {} : { scale: 1.04 }}
            whileTap={prefersReduced ? {} : { scale: 0.96 }}
          >
            {inWishlist ? "💖 In Wishlist" : "❤️ Wishlist"}
          </motion.button>

          <motion.button
            type="button"
            className="text-xs px-3 py-1 bg-black text-white rounded hover:bg-gray-800 pi-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
            onClick={() => navigate(`/product/${id}`)}
            whileHover={prefersReduced ? {} : { scale: 1.05, y: -1 }}
            whileTap={prefersReduced ? {} : { scale: 0.96 }}
          >
            Buy Now
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default memo(ProductItem);