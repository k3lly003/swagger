"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionTitle = ({
  title,
  subtitle,
  centered = false,
  className,
}: SectionTitleProps) => {
  return (
    <div
      className={cn(
        "mb-8 animate-fade-in",
        centered ? "text-center mx-auto" : "",
        className,
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h2>
      {subtitle && (
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
