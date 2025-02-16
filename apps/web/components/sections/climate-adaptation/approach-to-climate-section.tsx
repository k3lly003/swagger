"use client";

import React from "react";
import { motion } from "framer-motion";
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

const itemVariants = {
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

const ApproachToClimateSection = () => {
  // Data for approach cards
  const approachData = [
    {
      number: "01",
      title: "Data-Driven Decisions",
      description:
        "We conduct a comprehensive climate data inventory and use spatial analysis & vulnerability mapping to identify high-risk agricultural areas, ensuring that adaptation strategies are informed by real-time insights.",
      color: "bg-primary-green",
    },
    {
      number: "02",
      title: "Community-Centered Adaptation",
      description:
        "Through local consultation and traditional knowledge integration, we incorporate indigenous farming practices into climate policies while ensuring that farmers, cooperatives, and local leaders are actively engaged in decision-making.",
      color: "bg-yellow-400",
    },
    {
      number: "03",
      title: "Practical Learning & Innovation",
      description:
        "GanzAfrica promotes environmental sustainability by training youth in climate resilience, sustainable land and water management, and ecosystem restoration to build a greener, more resilient Africa.",
      color: "bg-yellow-400",
    },
    {
      number: "04",
      title: "Capacity Building & Sustainable Impact",
      description:
        "We strengthen local adaptation systems through training, mentorship, and knowledge-sharing initiatives, equipping farmers, policymakers, and researchers with the tools needed to implement long-term climate resilience strategies.",
      color: "bg-primary-green",
    },
  ];

  return (
    <section className="py-16 bg-[#F5F5F5] bg-opacity-75">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column - Title and Description */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span>Our approach to </span>
              <span className="text-primary-green">Climate Adaptation</span>
            </h2>

            <p className="text-gray-700 leading-relaxed">
              At GanzAfrica, we are committed to shaping a sustainable and
              prosperous Africa by empowering youth through training,
              mentorship, and work placement programs in the fields of land
              management, environmental sustainability, and agriculture. Our
              holistic approach integrates knowledge, innovation, and policy
              engagement to build future leaders who can drive meaningful change
              in Africa's food systems.
            </p>
          </motion.div>

          {/* Right Column - Timeline with items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {approachData.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="flex">
                <div className="mr-6">
                  <div
                    className={`relative w-12 h-12 rounded-full ${item.color} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold">{item.number}</span>
                  </div>
                  {index < approachData.length - 1 && (
                    <div className="w-0.5 h-[calc(100%-3rem)] border-l-2 border-dotted border-primary-green/60 ml-6 my-2"></div>
                  )}
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-3`}>{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ApproachToClimateSection;
