import { ReactNode } from 'react';

interface DecoratedHeadingProps {
  children: ReactNode;
  className?: string;
}

export function DecoratedHeading({ children, className = '' }: DecoratedHeadingProps) {
  return (
    <h2 className={`text-3xl font-bold text-center mb-8 relative ${className}`}>
      <span className="relative z-10">{children}</span>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-24 h-1 bg-primary"></div>
    </h2>
  );
} 