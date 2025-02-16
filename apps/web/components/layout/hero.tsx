import React from "react";
import Image from "next/image";

interface HeroProps {
  imageSrc: string;
  imageAlt: string;
}

const Hero: React.FC<HeroProps> = ({ imageSrc, imageAlt }) => {
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/team.png"
          alt="Agricultural fields"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-20">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight">
          Rooted in <span className="text-primary-orange">Excellence</span>,
          <br />
          <span className="text-primary-orange">Growing</span> with{" "}
          <span className="text-primary-orange">Agriculture</span>
        </h1>

        <h2 className="text-primary-orange text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider mt-6">
          FOOD SYSTEM
        </h2>
      </div>
    </section>
  );
};

export default Hero;
