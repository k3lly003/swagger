// @ts-nocheck

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DecoratedHeading } from "@/components/layout/headertext";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Program {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface FlagshipProgramsSectionProps {
  locale: string;
  dict: any;
}

export default function FlagshipProgramsSection({
  locale,
  dict,
}: FlagshipProgramsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Default program data with fallbacks
  const defaultPrograms: Program[] = [
    {
      id: "fellowship",
      title: "Fellowship Program",
      description:
        "Our fellowship program provides young leaders with the skills and opportunities to drive sustainable change.",
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/fellowship`,
    },
    {
      id: "alumni",
      title: "Alumni Program",
      description:
        "Building a network of skilled professionals driving Africa's transformation in land, agriculture, and environment.",
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/alumni`,
    },
    {
      id: "policy",
      title: "Policy Support Program",
      description:
        "We provide research and guidance to support sustainable policy development across Africa.",
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/policy-support`,
    },
  ];

  // Get programs from dictionary or use defaults
  const programs: Program[] = [
    {
      id: "fellowship",
      title: dict?.programs?.fellowship?.title || defaultPrograms[0]?.title,
      description:
        dict?.programs?.fellowship?.description ||
        defaultPrograms[0]?.description,
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/fellowship`,
    },
    {
      id: "alumni",
      title: dict?.programs?.alumni?.title || defaultPrograms[1]?.title,
      description:
        dict?.programs?.alumni?.description || defaultPrograms[1]?.description,
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/alumni`,
    },
    {
      id: "policy",
      title: dict?.programs?.policy_support?.title || defaultPrograms[2]?.title,
      description:
        dict?.programs?.policy_support?.description ||
        defaultPrograms[2]?.description,
      image: "/images/ganzafrica-fellows.jpg",
      link: `/${locale}/programs/policy-support`,
    },
  ] as const;

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % programs.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + programs.length) % programs.length,
    );
  };

  const getVisiblePrograms = () => {
    const left = (activeIndex - 1 + programs.length) % programs.length;
    const center = activeIndex;
    const right = (activeIndex + 1) % programs.length;
    return [programs[left], programs[center], programs[right]];
  };

  // Handle click on a card
  const handleCardClick = (idx: number) => {
    // If clicking left card, go to previous slide
    if (idx === 0) {
      prevSlide();
    }
    // If clicking right card, go to next slide
    else if (idx === 2) {
      nextSlide();
    }
    // Center card already active, do nothing
  };

  const getIndicatorPosition = () => {
    return activeIndex * 33.33;
  };

  const visiblePrograms = getVisiblePrograms();

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <DecoratedHeading
            firstText={dict?.programs?.flagship_heading_first || "Our Flagship"}
            secondText={dict?.programs?.flagship_heading_second || "Programs"}
            firstTextColor="text-primary-green"
            secondTextColor="text-primary-orange"
            borderColor="border-primary-green"
            cornerColor="bg-primary-orange"
            className="mx-auto"
          />
        </div>

        <div className="relative mb-12">
          <div className="flex justify-center items-start gap-4 md:gap-8 relative h-[450px] md:h-[500px]">
            {visiblePrograms.map((program, idx) => {
              const isCenter = idx === 1;

              if (!program) return null;

              return (
                <motion.div
                  key={program.id}
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                  className={`
                                        relative rounded-2xl overflow-hidden cursor-pointer group
                                        ${
                                          isCenter
                                            ? "w-full md:w-[550px] z-10 flex-grow-0 flex-shrink-0 h-full"
                                            : "w-[120px] sm:w-[200px] md:w-[280px] flex-shrink-0 h-[85%]"
                                        }
                                    `}
                  onClick={() => handleCardClick(idx)}
                >
                  {isCenter ? (
                    <div className="relative h-full overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={program.image}
                          alt={program.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 550px"
                          priority
                          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                        />
                        {/* Overlay that adjusts opacity on hover */}
                        <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-30 transition-opacity duration-700"></div>
                      </div>

                      <div className="absolute -left-1 bottom-12 top-2/5 right-0 flex items-center">
                        <div className="max-w-[70%] transform transition-transform duration-500">
                          <h3
                            className="bg-white rounded-r-3xl inline-block text-xl md:text-2xl font-bold text-gray-900 p-2"
                            style={{
                              borderBottomRightRadius: "0",
                            }}
                          >
                            {program.title}
                          </h3>
                          <p className="bg-white rounded-r-3xl inline-block text-sm md:text-base text-gray-700 px-4 py-2">
                            {program.description}
                          </p>
                          <Link
                            href={program.link}
                            prefetch={true}
                            className="bg-white rounded-r-3xl inline-block"
                            style={{
                              borderTopRightRadius: "0",
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering card click
                          >
                            <button className="text-secondary-green hover:text-primary-green transition-colors flex items-center group px-4 py-2">
                              <span className="font-medium">
                                {dict?.cta?.learn_more || "LEARN MORE"}
                              </span>
                              <ArrowRight className="h-5 w-5 ml-2 transform -rotate-45 group-hover:translate-x-1 group-hover:translate-y-[-4px] transition-transform duration-300 text-primary-green" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src={program.image}
                          alt={program.title}
                          fill
                          sizes="280px"
                          priority
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-sm md:text-base font-medium text-center text-gray-900">
                          {program.title}
                        </h3>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center items-center gap-3 mt-8">
            <div className="w-32 md:w-40 h-1.5 bg-primary-orange rounded-full overflow-hidden relative">
              <div
                className="h-full bg-secondary-green absolute left-0 top-0 transition-all duration-500 ease-in-out w-10"
                style={{ left: `${getIndicatorPosition()}%` }}
              ></div>
            </div>

            <button
              onClick={prevSlide}
              className="p-2 rounded-full border-2 border-gray-500 bg-white hover:bg-secondary-green transition-colors"
              aria-label="Previous program"
            >
              <ChevronLeft className="w-6 h-6 text-primary-orange" />
            </button>

            <button
              onClick={nextSlide}
              className="p-2 rounded-full border-2 border-gray-500 bg-white hover:bg-secondary-green transition-colors"
              aria-label="Next program"
            >
              <ChevronRight className="w-6 h-6 text-primary-orange" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
