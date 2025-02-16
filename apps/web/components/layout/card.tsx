"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  iconBgColor?: string;
}

export const Card = ({
  title,
  description,
  icon,
  className,
  iconBgColor = "bg-green/10",
}: CardProps) => {
  return (
    <div
      className={cn(
        "card-highlight group animate-fade-in-up overflow-hidden",
        className,
      )}
    >
      {icon && (
        <div className={cn("mb-5 -mx-6 -mt-6", iconBgColor)}>{icon}</div>
      )}
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
