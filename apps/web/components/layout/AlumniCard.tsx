import React from "react";
import { cn } from "@/lib/utils";

interface AlumniCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AlumniCard = ({
  children,
  className,
}: AlumniCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg shadow-lg bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}; 