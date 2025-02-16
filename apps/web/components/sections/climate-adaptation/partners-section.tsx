"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/container";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Partners logos data (sample logos)
const partnerLogos = [
  {
    name: "African Management Institute",
    src: "/images/partners/AMI 1.jpg",
  },
  {
    name: "Skills Builder Partnership",
    src: "/images/partners/Skillsbuilder 1.jpg",
  },
  {
    name: "African Leadership Academy",
    src: "/images/partners/ala 1.jpg",
  },
  {
    name: "Skills Builder Partnership 2",
    src: "/images/partners/Skillsbuilder 1.jpg",
  },
  {
    name: "African Leadership Academy 2",
    src: "/images/partners/ala 1.jpg",
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text content */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span>Partners in </span>
              <span className="text-primary-green">Climate action</span>
            </h2>
            <p className="text-gray-600 mb-6">
              We extend our sincere gratitude to all our partners who support
              our work in climate adaptation. Your commitment to building
              sustainable, resilient, and equitable climate solutions has been
              instrumental to our success.
            </p>
          </motion.div>

          {/* Partners logos */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {partnerLogos.map((logo, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center h-20"
                variants={logoVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={150}
                  height={80}
                  className="object-contain max-h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default PartnersSection;
