"use client";
import React from "react";

const HeaderBelt = () => {
  return (
    <div className="bg-yellow-400 py-4 w-full relative overflow-hidden">
      <div className="flex justify-center items-center w-full">
        <div className="marquee-container overflow-hidden w-full max-w-2xl mx-auto">
          <div className="marquee-content flex whitespace-nowrap animate-marquee">
            <div className="flex space-x-8 px-4 mx-4">
              <span className="text-base font-medium">• Food Systems</span>
              <span className="text-base font-medium">• Data & Evidence</span>
              <span className="text-base font-medium">• Co-creation</span>
              <span className="text-base font-medium">• Data & Evidence</span>
            </div>
            <div className="flex space-x-8 px-4 mx-4">
              <span className="text-base font-medium">• Food Systems</span>
              <span className="text-base font-medium">• Data & Evidence</span>
              <span className="text-base font-medium">• Co-creation</span>
              <span className="text-base font-medium">• Data & Evidence</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeaderBelt;
