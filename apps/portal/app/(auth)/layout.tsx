import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f0f4f3]">
      <div
        className="absolute top-0 right-0 h-96 w-96 -translate-y-10 translate-x-10 transform bg-blue"
        style={{
          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
          width: "35%",
          height: "35%",
        }}
      />

      <div className="absolute bottom-0 left-0 h-80 w-80 translate-y-20 -translate-x-20 transform rounded-full bg-primary-orange " />
      {/* Content container */}
      <div className="relative z-10 flex h-screen items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
