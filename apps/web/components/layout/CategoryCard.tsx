"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  color?: "primary-green" | "yellow-400";
}

const CategoryCard = ({
  title,
  description,
  icon,
  className,
  color = "yellow-400",
}: CategoryCardProps) => {
  const colorClasses: Record<"primary-green" | "yellow-400", string> = {
    "primary-green":
      "bg-white border-l-12 border-green-600 relative after:content-[''] after:absolute after:left-0 after:top-4 after:h-[calc(100%-2rem)] after:w-3 after:bg-green-600",
    "yellow-400":
      "bg-white border-l-12 border-yellow-400 relative after:content-[''] after:absolute after:left-0 after:top-4 after:h-[calc(100%-2rem)] after:w-3 after:secondary-yellow",
  };

  const iconColorClasses: Record<"primary-green" | "yellow-400", string> = {
    "primary-green": "bg-green-600 text-white",
    "yellow-400": "secondary-yellow text-white",
  };

  return (
    <div
      className={cn(
        "rounded-md shadow-sm p-6 transition-all duration-300 hover:shadow-md animate-fade-in", // added animation class here
        colorClasses[color], // conditional color styles
        className,
      )}
    >
      <div className="flex items-start">
        {icon && (
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mr-4 mt-1", // adjusting icon positioning and size
              iconColorClasses[color], // conditional icon color styles
            )}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>{" "}
          {/* Title color updated */}
          <p className="text-gray-700">{description}</p>{" "}
          {/* Description text color adjusted */}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
