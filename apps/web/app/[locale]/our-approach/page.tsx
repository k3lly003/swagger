"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import HeaderBelt from "@/components/layout/headerBelt";
import WhereWeWorkSection from "@/components/sections/food-system/where-we-work-section";
import ImpactAreasSection from "@/components/sections/food-system/impact-areas-section";
import FoodSystemsMapSection from "@/components/sections/food-system/food-systems-map-section";
import ApproachSection from "@/components/sections/food-system/approach-section";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const FoodSystemPage = ({}) => {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/food-system.jpeg"
            alt="Food System"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 z-10"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-20">
          <motion.h1
            className="text-white text-2xl sm:text-3xl md:text-4xl mb-2 leading-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span>The </span>
            <span className="text-yellow-400 font-bold">Journey</span>
            <span> from </span>
            <span className="text-yellow-400 font-bold">Farm </span>
            <span>to </span>
            <span className="text-yellow-400 font-bold">Fork</span>
          </motion.h1>
          <motion.h2
            className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            FOOD SYSTEM
          </motion.h2>
        </div>
      </section>

      {/* Banner Section */}
      <div className="w-full overflow-hidden">
        <div className="flex justify-center">
          <HeaderBelt />
        </div>
      </div>
      
      {/* Page Content */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <ApproachSection />
        <WhereWeWorkSection />
        <ImpactAreasSection />
        <FoodSystemsMapSection />
      </motion.div>
    </main>
  );
};

export default FoodSystemPage;