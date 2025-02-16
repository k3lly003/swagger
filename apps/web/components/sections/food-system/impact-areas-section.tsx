"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/container";
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

// Card component for impact areas
const ImpactCard = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
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
              className="w-8 h-8 rounded-full bg-primary-green flex items-center justify-center cursor-pointer"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(5, 150, 105, 0.8)",
              }}
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

const ImpactAreasSection = () => {
  return (
    <section className="py-16 bg-[#F5F5F5] bg-opacity-75">
      <Container>
        <motion.div
          className="text-center mb-12"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span>Our Impact </span>
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
          className="grid grid-cols-1 md:grid-cols-10 gap-6 items-center justify-center px-32"
        >
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="">
              <ImpactCard
                title="Digital Systems"
                description="Leveraging technology to drive data collection and evidence-based decision making across food value chains."
                image="/images/food-system-1.png"
              />
            </div>
            <div className="">
              <ImpactCard
                title="Climate Change Adaptation"
                description="Supporting smallholder farmers with climate-smart agricultural techniques, regenerative farming practices, and appropriate technologies."
                image="/images/food-system-1.png"
              />
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="">
              <ImpactCard
                title="Policy Implementation"
                description="Leveraging technology to drive data collection and evidence-based decision making across food value chains."
                image="/images/food-system-1.png"
              />
            </div>
            <div className="">
              <ImpactCard
                title="Data & Evidence"
                description="Supporting smallholder farmers with climate-smart agricultural techniques, regenerative farming practices, and appropriate technologies."
                image="/images/food-system-1.png"
              />
            </div>
          </div>

          {/* <motion.div
                        className="md:col-span-7 h-full"
                        variants={itemVariants}
                    >
                        <div className="bg-white rounded-[20px] border border-gray-lighter overflow-hidden shadow-sm hover:shadow-md h-full">
                            <div className="p-4 h-full flex flex-col">
                                <div className="rounded-[15px] overflow-hidden mb-4 flex-grow relative">
                                    <Image
                                        src="/images/food-system-1.png"
                                        alt="Food systems hands"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="bg-white rounded-b-[20px] p-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-3">Policy Advocacy</h3>
                                            <p className="text-gray-600">
                                                Working with governments and regional bodies to create enabling policy environments for sustainable food systems.
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            <motion.div
                                                className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer"
                                                whileHover={{ scale: 1.1, backgroundColor: "rgba(251, 191, 36, 0.8)" }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <ArrowRight className="w-4 h-4 text-white" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div> */}
        </motion.div>
      </Container>
    </section>
  );
};

export default ImpactAreasSection;
