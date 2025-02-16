// @ts-nocheck

"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { DecoratedHeading } from "@/components/layout/headertext";
import { CircleCheck } from "lucide-react";

// Custom CheckCircle component with color fill
const ColoredCheckCircle = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 rounded-full ${color}`}
        style={{ zIndex: 1 }}
      ></div>
      <CircleCheck className="relative z-10 text-white" />
    </div>
  );
};

interface WhyGanzAfricaSectionProps {
  locale: string;
  dict: any;
}

export default function WhyGanzAfricaSection({
  locale,
  dict,
}: WhyGanzAfricaSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bulletPointsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!sectionRef.current) return;

    // Animate bullet points
    const bulletPoints = bulletPointsRef.current.filter(Boolean);

    gsap.fromTo(
      bulletPoints,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      },
    );

    return () => {
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col lg:flex-row items-stretch gap-12">
          {/* Image section with speech bubble */}
          <div className="relative flex-1 w-full max-w-lg mx-auto lg:mx-0 lg:self-stretch flex">
            <div className="relative rounded-2xl overflow-hidden shadow-xl w-full h-full flex-1">
              <Image
                src="/images/2-fellows.jpg"
                alt={
                  dict.about?.fellows_photo_alt ||
                  "GanzAfrica fellows collaborating"
                }
                fill
                priority
                className="object-cover"
              />

              {/* Agriculture Professional Leader speech bubble */}
              <div className="absolute top-10 left-10 w-32">
                {/* Speech bubble with tail pointing to bottom right */}
                <div className="relative bg-secondary-yellow p-4 rotate-[-2deg] shadow-md rounded-md">
                  <p
                    className="text-dark font-bold text-sm leading-tight"
                    style={{ fontFamily: "'Covered By Your Grace', cursive" }}
                  >
                    {dict.home?.why_section?.sticky_note_line1 || "Agriculture"}
                    <br />
                    {dict.home?.why_section?.sticky_note_line2 ||
                      "Professional"}
                    <br />
                    {dict.home?.why_section?.sticky_note_line3 || "Leader"}
                  </p>
                  {/* Speech bubble tail pointing to bottom right */}
                  <div className="absolute bottom-0 right-4 w-4 h-4 bg-secondary-yellow transform rotate-45 translate-y-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 lg:pl-8 flex flex-col">
            <div className="mb-8">
              <DecoratedHeading
                firstText={dict.home?.why_section?.heading_first || "Why"}
                secondText={
                  dict.home?.why_section?.heading_second || "GanzAfrica?"
                }
                firstTextColor="text-primary-green"
                secondTextColor="text-primary-orange"
                borderColor="border-primary-green"
                cornerColor="bg-primary-orange"
              />
            </div>

            <p className="text-gray-600 mb-8 font-regular-paragraph">
              {dict.home?.why_section?.description ||
                "There are many variations of passages of available but the majority have suffered alteration in some form by injected humor or random word which don't look even."}
            </p>

            <div className="space-y-6">
              {/* Bullet Point 1 */}
              <div
                ref={(el) => {
                  bulletPointsRef.current[0] = el;
                  return undefined;
                }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  <ColoredCheckCircle
                    color="bg-primary-green"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="font-bold-paragraph text-dark mb-1">
                    {dict.home?.why_section?.point1_title ||
                      "We train and inspire future leaders"}
                  </h4>
                  <p className="text-gray-600 font-regular-paragraph">
                    {dict.home?.why_section?.point1_desc ||
                      "Create, connect, and develop a pool of committed and value-driven young Africans who can adapt new and emerging technologies in land, agriculture, and environment sub-sectors."}
                  </p>
                </div>
              </div>

              {/* Bullet Point 2 */}
              <div
                ref={(el) => {
                  bulletPointsRef.current[1] = el;
                  return undefined;
                }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  <ColoredCheckCircle
                    color="bg-secondary-green"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="font-bold-paragraph text-dark mb-1">
                    {dict.home?.why_section?.point2_title ||
                      "We drive continental collaboration"}
                  </h4>
                  <p className="text-gray-600 font-regular-paragraph">
                    {dict.home?.why_section?.point2_desc ||
                      "Build a continental coalition of informed and empowered young experts who can innovate, co-create and scale solutions in land, agriculture, and environment sub-sectors."}
                  </p>
                </div>
              </div>

              {/* Bullet Point 3 */}
              <div
                ref={(el) => {
                  bulletPointsRef.current[2] = el;
                  return undefined;
                }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  <ColoredCheckCircle
                    color="bg-lighter-green-100"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="font-bold-paragraph text-dark mb-1">
                    {dict.home?.why_section?.point3_title ||
                      "We create intergenerational links"}
                  </h4>
                  <p className="text-gray-600 font-regular-paragraph">
                    {dict.home?.why_section?.point3_desc ||
                      "Enhance cross-generational linkages between experienced and retired professionals and young practitioners, enhancing the co-creation of blended solutions combining novel and traditional ideals."}
                  </p>
                </div>
              </div>

              {/* Bullet Point 4 */}
              <div
                ref={(el) => {
                  bulletPointsRef.current[3] = el;
                  return undefined;
                }}
                className="flex items-start gap-4"
              >
                <div className="mt-1">
                  <ColoredCheckCircle
                    color="bg-primary-orange"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h4 className="font-bold-paragraph text-dark mb-1">
                    {dict.home?.why_section?.point4_title ||
                      "We promote innovative solutions"}
                  </h4>
                  <p className="text-gray-600 font-regular-paragraph">
                    {dict.home?.why_section?.point4_desc ||
                      "Support the development of innovative, scalable solutions that address critical challenges in food systems, climate resilience, and sustainable agricultural practices across the continent."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
