// @ts-nocheck

"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/container";
import { DecoratedHeading } from "@/components/layout/headertext";
import { ArrowRight } from "lucide-react";

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

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

// Card component for focus areas - for the right column cards
const FocusAreaCard = ({
  title,
  description,
  image,
  iconColor = "bg-primary-green",
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-[20px] border border-gray-lighter overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
    >
      <div className="p-4">
        <div className="rounded-[15px] overflow-hidden mb-4 relative">
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          <div className="ml-4">
            <motion.div
              className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center cursor-pointer`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KeyFocusAreasSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <motion.div
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span>Key Focus </span>
            <span className="text-primary-green">Areas</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our holistic approach integrates knowledge, innovation, and policy
            engagement to build future leaders who can drive meaningful change
            in Africa's food systems
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Left column - large card */}
          <motion.div className="md:col-span-5 h-full" variants={itemVariants}>
            <div className="bg-white rounded-[20px] border border-gray-lighter overflow-hidden shadow-sm hover:shadow-md h-full">
              <div className="p-4 h-full flex flex-col">
                <div className="rounded-[15px] overflow-hidden mb-4 flex-grow relative">
                  <Image
                    src="/images/food-system-1.png"
                    alt="Soil Health & Crop Suitability"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-white rounded-b-[20px] p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Soil Health & Crop Suitability
                      </h3>
                      <p className="text-gray-600">
                        Conducting soil analysis and crop suitability
                        assessments to optimize land use and promote sustainable
                        agricultural production.
                      </p>
                    </div>
                    <div className="ml-4">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column - two smaller cards */}
          <div
            className="md:col-span-7 flex flex-col gap-6"
            style={{ height: "100%" }}
          >
            <div className="h-1/2">
              <FocusAreaCard
                title="Sustainable Land Management"
                description="Implementing climate-smart land management practices to prevent soil degradation and enhance agricultural resilience."
                image="/images/food-system-1.png"
                iconColor="bg-primary-green"
              />
            </div>
            <div className="h-1/2">
              <FocusAreaCard
                title="Search Policy & GIS Mapping"
                description="Utilizing advanced geographic information systems to identify climate vulnerability hotspots and develop evidence-based adaptation policies."
                image="/images/food-system-1.png"
                iconColor="bg-primary-green"
              />
            </div>
          </div>

          {/* Bottom row - full width card */}
          <div className="md:col-span-12">
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-[20px] border border-gray-lighter overflow-hidden shadow-sm hover:shadow-md h-full"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-4">
                  <div className="rounded-[15px] overflow-hidden relative h-64 md:h-72">
                    <Image
                      src="/images/food-system-1.png"
                      alt="Community Engagement"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:w-1/3 p-6 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        Community Engagement & Information Sharing
                      </h3>
                      <p className="text-gray-600">
                        Implementing climate-smart land management practices to
                        prevent soil degradation and improve agricultural
                        resilience.
                      </p>
                    </div>
                    <div className="ml-4">
                      <motion.div
                        className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default KeyFocusAreasSection;
