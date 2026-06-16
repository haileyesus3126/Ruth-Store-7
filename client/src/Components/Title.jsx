// src/Components/Title.jsx
import React, { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Title
 *
 * Props:
 * - as: 'h1' | 'h2' | ... (default: 'h2')
 * - id: string (optional — auto-generated from text if not provided)
 * - text1: leading text (string)
 * - text2: highlighted/emphasized text (string)
 * - subtitle: optional supporting copy
 * - eyebrow: small label above the title (string)
 * - align: 'left' | 'center' | 'right' (default: 'center')
 * - highlightClassName: extra classes for the highlighted span
 */
const Title = ({
  as: HeadingTag = 'h2',
  id,
  text1,
  text2,
  subtitle,
  eyebrow,
  align = 'center',
  highlightClassName = '',
}) => {
  const prefersReduced = useReducedMotion();

  // Create a stable id if not provided (useful for anchor links / aria-labelledby)
  const autoId = useMemo(() => {
    const base = `${text1 ?? ''} ${text2 ?? ''}`.trim();
    return base
      .toLowerCase()
      .replace(/['’]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }, [text1, text2]);

  const headingId = id || (autoId ? `title-${autoId}` : undefined);

  // Map align to container classes
  const alignBlock =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';
  const alignInline =
    align === 'left' ? 'sm:items-start' : align === 'right' ? 'sm:items-end' : 'sm:items-center';

  // Motion (respect reduced motion)
  const containerVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', when: 'beforeChildren', staggerChildren: 0.08 } },
      };

  const itemVariants = prefersReduced
    ? {}
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      };

  // Reduce hover underline animation if requested
  const underlineClass = prefersReduced
    ? 'scale-x-100'
    : 'scale-x-100 sm:scale-x-0 sm:group-hover:scale-x-100';

  return (
    <motion.div
      className={`mb-6 ${alignBlock}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={containerVariants}
    >
      {/* Eyebrow (optional) */}
      {eyebrow && (
        <motion.div
          variants={itemVariants}
          className={`mb-2 text-xs tracking-wide text-gray-500 ${alignBlock}`}
        >
          {eyebrow}
        </motion.div>
      )}

      {/* Main Title row */}
      <div className={`inline-flex flex-col sm:flex-row ${alignInline} gap-3 group`}>
        <motion.div variants={itemVariants} className={`${alignBlock}`}>
          <HeadingTag
            id={headingId}
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#414141] tracking-wide"
          >
            <span>{text1} </span>
            {/* Use <mark> for semantic highlight; style reset for custom look */}
            <mark className={`bg-transparent p-0 font-semibold relative ${highlightClassName}`}>
              {text2}
            </mark>
          </HeadingTag>

          {/* underline (decorative) */}
          <span
            aria-hidden="true"
            className={`block w-full h-[2px] bg-[#414141] mt-1 transition-transform duration-300 origin-center ${underlineClass}`}
          />
        </motion.div>

        {/* Divider bar (only on sm+) */}
        <motion.div
          aria-hidden="true"
          variants={itemVariants}
          className="hidden sm:block w-10 sm:w-12 h-[2px] bg-[#414141]"
        />
      </div>

      {/* Subtitle (optional) */}
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className={`mt-2 text-sm sm:text-base text-gray-600 max-w-xl ${
            align === 'left' ? '' : 'mx-auto'
          }`}
          {...(headingId ? { 'aria-describedby': headingId } : {})}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default memo(Title);
