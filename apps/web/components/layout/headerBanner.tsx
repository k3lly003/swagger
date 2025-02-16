import React from "react";

const HeaderBanner = ({
  categories = ["Environment", "Agriculture", "Land", "Food system", "Climate"],
}) => {
  return (
    <div className="relative w-full overflow-visible">
      <div className="relative h-20 md:h-20">
        <div className="absolute top-0 left-0 bg-primary-green h-16 w-full"></div>

        <div
          className="absolute top-0 left-0 bg-primary-orange h-16 w-full origin-center"
          style={{
            transform: "rotate(-1deg) translateY(0)",
            zIndex: 10,
          }}
        >
          <div className="container mx-auto px-4 h-full overflow-x-auto">
            <div className="flex justify-between items-center h-full min-w-max">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center py-1 px-2 whitespace-nowrap"
                >
                  <div className="w-3 h-3 bg-black rounded-full mr-1 md:mr-3 flex-shrink-0"></div>
                  <span className="text-sm md:text-xl font-bold">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBanner;
