"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface SectionProps {
  number: string;
  title: string;
  text: string;
  imageUrl: string;
  imageAlt: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  imageFirst: boolean;
  contentClass: string;
}

export default function SectionWithScrollAnimation({
  number,
  title,
  text,
  imageUrl,
  imageAlt,
  bgColor,
  accentColor,
  textColor,
  imageFirst,
  contentClass,
}: SectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Create faster, more responsive scroll-based animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.95", "start 0.5"], // Narrower range for faster transition
  });

  // Create grid order based on image position
  const contentOrder = !imageFirst ? "md:order-1" : "md:order-2";
  const imageOrder = !imageFirst ? "md:order-2" : "md:order-1";

  // Animation variants for coming from sides
  const contentInitialX = !imageFirst ? -100 : 100;
  const imageInitialX = !imageFirst ? 100 : -100;

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 overflow-hidden"
    >
      <motion.div
        className={`p-10 ${bgColor}  min-h-full lg:h-[510px] w-full rounded-sm ${contentOrder}`}
        initial={{ opacity: 0, x: contentInitialX }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      >
        <div className="flex flex-col h-full w-full">
          <motion.div
            className={`${accentColor} text-white w-16 h-16 flex items-center justify-center text-2xl rounded-md font-bold mb-2`}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            viewport={{ once: false }}
          >
            {number}
          </motion.div>
          <motion.h2
            className={`${textColor} sm: font-h5  md:font-h4 mb-2`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            viewport={{ once: false }}
          >
            {title}
          </motion.h2>
          <div className={contentClass}>
            <p className="text-black font-regular-small text-sm text-justify">
              {text}
            </p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className={`h-full w-full ${imageOrder}`}
        initial={{ opacity: 0, x: imageInitialX }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      >
        <div className="w-full h-full relative hidden md:block">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover rounded-sm"
          />
        </div>
      </motion.div>
    </div>
  );
}
