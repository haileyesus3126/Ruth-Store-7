import React, { Suspense, lazy } from "react";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import { motion } from "framer-motion";
import RecentlyViewed from "../Components/RecentlyViewed";

const BestSeller = lazy(() => import("../Components/BestSeller"));
const OurPolicy = lazy(() => import("../Components/OurPolicy"));
const NewsletterBox = lazy(() => import("../Components/NewsletterBox"));

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const Home = () => {
  return (
    <div className="home-page">
      <Hero />

      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        aria-label="Latest Collections"
      >
        <LatestCollection />
      </motion.section>

      <Suspense fallback={<div className="text-center py-10">Loading Bestsellers...</div>}>
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          aria-label="Best Sellers"
        >
          <BestSeller />
        </motion.section>
      </Suspense>

      <Suspense fallback={<div className="text-center py-10">Loading Policies...</div>}>
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          aria-label="Our Policy"
        >
          <OurPolicy />
        </motion.section>
      </Suspense>

      <Suspense fallback={<div className="text-center py-10">Loading Newsletter...</div>}>
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          aria-label="Newsletter"
        >
          <RecentlyViewed />
          <NewsletterBox />
        </motion.section>
      </Suspense>
    </div>
  );
};

export default Home;