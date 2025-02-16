"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/container";
import { DecoratedHeading } from "@/components/layout/headertext";

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

const imageVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const ClimateResilienceSection = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="flex justify-center mb-10">
          <DecoratedHeading
            firstText="Building climate Resilience"
            secondText="in Agriculture"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Left Column - Image with Circle Overlay */}
          <motion.div
            className="md:col-span-5 relative mx-auto"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Main image - circular */}
            <div className="rounded-full overflow-hidden w-[320px] h-[320px] relative">
              <Image
                src="/images/food-system-1.png"
                alt="Hands holding grains"
                fill
                className="object-cover"
              />
            </div>

            {/* Circle overlay with person image */}
            <div className="absolute -bottom-5 -left-5 w-[120px] h-[120px] border-4 border-primary-green rounded-full overflow-hidden shadow-lg">
              <div className="w-full h-full bg-primary-green rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/food-system.jpeg"
                  alt="Young professional"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="md:col-span-7 space-y-6"
          >
            <p className="text-gray-700">
              At GanzAfrica, we are committed to enhancing local resilience to
              climate change through a data-driven, community-centered, and
              impact-oriented approach. Our initiative integrates cutting-edge
              scientific research, time-honored traditional knowledge, and
              innovative technologies to develop sustainable, scalable solutions
              that address the complex and pressing challenges posed by climate
              change in agricultural systems across Africa.
            </p>

            <p className="text-gray-700">
              By equipping farmers, policymakers, researchers, and stakeholders
              with the specialized knowledge, advanced tools, and adaptive
              strategies needed to respond effectively to changing climate
              patterns, we aim to strengthen climate-smart agriculture
              practices, enhance regional food security, and promote sustainable
              land and water management systems. Through collaborative
              engagement, real-world demonstration projects, and evidence-based
              policy advocacy, GanzAfrica is driving a transformative shift
              towards climate-resilient food systems that can withstand
              environmental shocks while ensuring long-term agricultural
              productivity and economic stability for rural communities across
              Africa.
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ClimateResilienceSection;
