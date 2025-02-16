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

const WhereWeWorkSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          {/* <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        <span>Where does our </span>
                        <span className="text-primary-green">work reside?</span>
                    </h2> */}
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our holistic approach addresses challenges and leverages
            opportunities in 3 main sectors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative h-full rounded-[20px] overflow-hidden"
          >
            <Image
              src="/images/food-system-1.png"
              alt="Hands holding wheat grains"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {/* Land Management */}
            <motion.div variants={itemVariants} className="flex">
              <div className="mr-6">
                <div className="relative w-12 h-12 rounded-full bg-primary-green flex items-center justify-center">
                  <span className="text-white font-bold">01</span>
                </div>
                <div className="w-0.5 h-[calc(100%-3rem)] border-l-2 border-dotted border-primary-green/60 ml-6 my-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-green mb-3">
                  Land Management
                </h3>
                <p className="text-gray-600 text-justify">
                  Sustainable land use is vital for food security, environmental
                  resilience, and economic growth. GanzAfrica advocates for
                  equitable land policies to empower youth, farmers, and
                  marginalized communities, promotes responsible land management
                  to prevent degradation and enhance productivity, and equips
                  young leaders with data literacy and analytical skills to
                  influence land governance policies.
                </p>
              </div>
            </motion.div>

            {/* Agriculture */}
            <motion.div variants={itemVariants} className="flex">
              <div className="mr-6">
                <div className="relative w-12 h-12 rounded-full bg-primary-orange flex items-center justify-center">
                  <span className="text-white font-bold">02</span>
                </div>
                <div className="w-0.5 h-[calc(100%-3rem)] border-l-2 border-dotted border-primary-orange/60 ml-6 my-2"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-green mb-3">
                  Agriculture
                </h3>
                <p className="text-gray-600 text-justify">
                  Agriculture is the largest employer in Africa, and GanzAfrica
                  is leading efforts to make it more productive, innovative, and
                  inclusive. We provide hands-on training in modern,
                  technology-driven farming techniques, support value chain
                  development to improve market access and food production
                  efficiency, and introduce smart farming technologies to
                  optimize production while minimizing environmental impact.
                </p>
              </div>
            </motion.div>

            {/* Environment */}
            <motion.div variants={itemVariants} className="flex">
              <div className="mr-6">
                <div className="relative w-12 h-12 rounded-full bg-primary-green flex items-center justify-center">
                  <span className="text-white font-bold">03</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-green mb-3">
                  Environment
                </h3>
                <p className="text-gray-600 text-justify">
                  GanzAfrica promotes environmental sustainability by training
                  youth in climate resilience, sustainable land and water
                  management, and ecosystem restoration to build a greener, more
                  resilient Africa.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default WhereWeWorkSection;
