import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("text-primary font-bold text-3xl", className)}>
      <Image src="/logo.png" alt="Logo" width={500} height={500} />
    </div>
  );
}
