"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

interface KeyElement {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface GanzAfricaUniqueSectionProps {
  locale: string;
  dict: any;
}

export default function GanzAfricaUniqueSection({
  locale,
  dict,
}: GanzAfricaUniqueSectionProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Get section content from dictionary with fallbacks
  const sectionTitle =
    dict?.unique?.title || "Three Key Elements that make GanzAfrica Unique";

  // Define the key elements with content from dictionary
  const keyElements: KeyElement[] = [
    {
      title: dict?.unique?.elements?.data?.title || "Data and Evidence",
      description:
        dict?.unique?.elements?.data?.description ||
        "We champion a data-based approach, equipping our fellows with key skills in data analytics to support evidence-based decision-making and policy design.",
      icon: "/images/icons/data-icon.svg", // Replace with your actual icon path
      color: "primary-orange",
    },
    {
      title: dict?.unique?.elements?.implementation?.title || "Implementation",
      description:
        dict?.unique?.elements?.implementation?.description ||
        "We go beyond ideas, cultivating a generation of young african leaders with the skills and resources to translate their vision into reality, implementing solutions to improve communities livelihood in Africa.",
      icon: "/images/icons/implementation-icon.svg", // Replace with your actual icon path
      color: "primary-green",
    },
    {
      title:
        dict?.unique?.elements?.public_sector?.title || "The Public Sector",
      description:
        dict?.unique?.elements?.public_sector?.description ||
        "We aim to solve endemic and important public sector challenges, based on the belief that only solutions at this level lead to large-scale and long-lasting impact in agriculture and food systems.",
      icon: "/images/icons/public-sector-icon.svg", // Replace with your actual icon path
      color: "secondary-yellow",
    },
  ];

  // Handler for video play button
  const handlePlayVideo = () => {
    setVideoPlaying(true);
    // In a real implementation, you would trigger your video player here
  };

  return (
    <section className="py-16 md:py-24 bg-[#e3f1ed]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column with title and video */}
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-green leading-tight mb-8">
              {sectionTitle}
            </h2>

            {/* Video thumbnail with play button */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/10">
              <Image
                src="/images/farmers-working.jpg" // Replace with your actual video thumbnail
                alt="GanzAfrica farmers in field"
                fill
                className="object-cover"
              />

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayVideo}
                  className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30"
                  aria-label="Play video"
                >
                  <PlayCircle className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Right column with key elements */}
          <div className="space-y-8">
            {keyElements.map((element, index) => (
              <div
                key={element.title}
                className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row"
              >
                {/* Colored sidebar */}
                <div
                  className={`w-full md:w-2 h-2 md:h-auto bg-${element.color}`}
                ></div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 bg-primary-green rounded-full flex items-center justify-center">
                        <Image
                          src={element.icon}
                          width={24}
                          height={24}
                          alt={element.title}
                          className="text-white"
                        />
                      </div>
                    </div>

                    {/* Text content */}
                    <div>
                      <h3 className="text-lg font-bold text-primary-green mb-2">
                        {element.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {element.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
