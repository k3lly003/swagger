// @ts-nocheck

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/layout/container";
import { MapPin, X, ChevronRight, Info } from "lucide-react";
import { DecoratedHeading } from "@/components/layout/headertext";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const FoodSystemsMapSection = () => {
  const [selectedCountry, setSelectedCountry] = useState("rwanda");
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  const mapRef = useRef(null);
  const mapIframeRef = useRef(null);

  // Stats data
  const stats = [
    { label: "Fellows", count: 20 },
    { label: "Projects", count: "20+" },
    { label: "Communities", count: 15 },
    { label: "Countries", count: 2 },
  ];

  // Countries data
  const countries = [
    { name: "Rwanda", value: "rwanda" },
    { name: "Burkina Faso", value: "burkina" },
  ];

  // Project locations data
  const projectLocations = [
    {
      id: 1,
      title: "Sustainable Farming Initiative",
      description:
        "The agricultural training program targets new sustainable farming practices to improve crop yields and food security.",
      image: "/images/food-system-1.png",
      country: "rwanda",
      location: "Musanze",
      address: "Kinigi Sector, Musanze District, Rwanda",
      mapCoordinates: { lat: -1.4969, lng: 29.6259 },
      mapPosition: { x: 300, y: 180 },
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63776.95946876503!2d29.591339705532292!3d-1.4968819286622052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc4e45426592c5%3A0x7bf59f53e5c2b097!2sMusanze%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712019657396!5m2!1sen!2sus",
      contactPerson: "Jean Bosco",
      url: "/projects/sustainable-farming",
    },
    {
      id: 2,
      title: "Rural Development Program",
      description:
        "Supporting rural communities with agricultural resources and training to create sustainable livelihoods.",
      image: "/images/food-system-1.png",
      country: "rwanda",
      location: "Nyabihu",
      address: "Mukamira Sector, Nyabihu District, Rwanda",
      mapCoordinates: { lat: -1.6579, lng: 29.5006 },
      mapPosition: { x: 220, y: 250 },
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63780.843420073026!2d29.498345699999998!3d-1.6578639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dc5918838703c5%3A0xfb77da79fea2e4eb!2sNyabihu%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1712019752780!5m2!1sen!2sus",
      contactPerson: "Marie Claire",
      url: "/projects/rural-development",
    },
    {
      id: 3,
      title: "Agribusiness Accelerator",
      description:
        "Supporting agricultural entrepreneurs to develop sustainable businesses and increase productivity.",
      image: "/images/food-system-1.png",
      country: "burkina",
      location: "Ouagadougou",
      address: "Ouagadougou, Burkina Faso",
      mapCoordinates: { lat: 12.3714, lng: -1.5197 },
      mapPosition: { x: 320, y: 230 },
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125171.40082591335!2d-1.6126624448655638!3d12.36712576629056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe2e9c23908451f%3A0x1f1d8074e9c2d0ab!2sOuagadougou%2C%20Burkina%20Faso!5e0!3m2!1sen!2sus!4v1712031172461!5m2!1sen!2sus",
      contactPerson: "Ibrahim Ouedraogo",
      url: "/projects/agribusiness-burkina",
    },
  ];

  // Filtered locations based on selected country
  const filteredLocations = projectLocations.filter(
    (location) => location.country === selectedCountry,
  );

  const currentProject = selectedProject
    ? projectLocations.find((p) => p.id === selectedProject)
    : null;

  // Event handlers
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedProject(null);
    setExpandedCard(null);
  };

  const handleProjectClick = (projectId) => {
    if (selectedProject === projectId) {
      setExpandedCard(expandedCard === projectId ? null : projectId);
    } else {
      setSelectedProject(projectId);
      setExpandedCard(null);
    }
  };

  const handleExpandClick = (projectId, e) => {
    e.stopPropagation();
    setExpandedCard(expandedCard === projectId ? null : projectId);
  };

  const getMarkerPosition = (position) => {
    const x = (position.x / 600) * mapDimensions.width;
    const y = (position.y / 400) * mapDimensions.height;
    return { x, y };
  };

  // Effects
  useEffect(() => {
    const updateMapDimensions = () => {
      if (mapRef.current) {
        setMapDimensions({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        });
      }
    };

    updateMapDimensions();
    window.addEventListener("resize", updateMapDimensions);

    return () => {
      window.removeEventListener("resize", updateMapDimensions);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span>Our Food Systems actions </span>
            <span className="text-primary-green">across Africa</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            GanzAfrica operates in two countries, equipping young professionals
            with the skills and opportunities to drive meaningful change in
            Africa's agri-food systems.
          </p>
        </motion.div>

        <div className="flex flex-col items-center mb-10">
          {/* Country selector and highlights button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <motion.div
              className="relative inline-block w-full sm:w-56"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                className="appearance-none bg-white border border-green-700 rounded-md py-2 pl-3 pr-10 w-full text-gray-700 focus:outline-none"
              >
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-green-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </motion.div>

            <motion.button
              className="bg-primary-orange hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Highlights of our work
            </motion.button>
          </div>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto mb-8"
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={statItemVariants}
              >
                <p className="text-3xl font-bold text-green-700">
                  {stat.count}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Map visualization */}
        <motion.div
          className="relative h-96 w-full rounded-lg overflow-hidden shadow-md border-2 border-gray-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          ref={mapRef}
        >
          {/* Google Maps iframe with marker */}
          <iframe
            ref={mapIframeRef}
            src={
              currentProject
                ? `${currentProject.mapUrl}&markers=color:red%7Clabel:G%7C${currentProject.mapCoordinates.lat},${currentProject.mapCoordinates.lng}`
                : filteredLocations[0]?.mapUrl
            }
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="GanzAfrica Location"
          ></iframe>

          {/* Project markers with in-map cards */}
          {filteredLocations.map((location) => {
            const position = getMarkerPosition(location.mapPosition);
            const isSelected = selectedProject === location.id;
            const isExpanded = expandedCard === location.id;

            return (
              <div
                key={location.id}
                className="absolute z-10"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
              >
                {/* Project marker */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => handleProjectClick(location.id)}
                >
                  {/* Marker with profile image */}
                  <div
                    className={`rounded-full overflow-hidden transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${isSelected ? "scale-110" : ""}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: `3px solid ${isSelected ? "#F59E0B" : "#047857"}`,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    <img
                      src={location.image}
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Location label */}
                  {isSelected && (
                    <div
                      className="absolute whitespace-nowrap text-center mt-1 text-xs font-medium bg-white px-2 py-1 rounded-md shadow-sm -translate-x-1/2"
                      style={{ top: "100%", left: "50%" }}
                    >
                      {location.location}
                    </div>
                  )}
                </div>

                {/* Project card */}
                {isSelected && (
                  <div
                    className={`absolute bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-20 ${isExpanded ? "w-64" : "w-52"}`}
                    style={{
                      top: "-105px",
                      left: "-110px",
                      transform: isExpanded ? "scale(1.1)" : "scale(1)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Card content */}
                    <div className="relative">
                      {/* Project image */}
                      <div
                        className={`relative ${isExpanded ? "h-32" : "h-24"}`}
                      >
                        <img
                          src={location.image}
                          alt={location.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-0.5 text-xs font-semibold rounded">
                          {location.location}
                        </div>

                        {/* Expand/collapse button */}
                        <button
                          className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                          onClick={(e) => handleExpandClick(location.id, e)}
                        >
                          {isExpanded ? (
                            <X className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Info className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Project info */}
                      <div className="p-3">
                        <h3 className="font-bold text-green-700 text-sm mb-1 line-clamp-1">
                          {location.title}
                        </h3>

                        {isExpanded ? (
                          <>
                            <p className="text-xs text-gray-600 mb-2">
                              {location.description}
                            </p>
                            <div className="flex items-start mb-2">
                              <MapPin className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600 ml-1">
                                {location.address}
                              </p>
                            </div>
                            <div className="text-xs text-gray-600 mb-3">
                              Contact: {location.contactPerson}
                            </div>
                            <a
                              href={location.url}
                              className="text-xs text-yellow-600 hover:text-yellow-800 font-medium inline-flex items-center"
                            >
                              Learn more
                              <ChevronRight className="ml-1 w-3 h-3" />
                            </a>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {location.description}
                            </p>
                            <a
                              href={location.url}
                              className="text-xs text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              View details
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Instructions */}
        <div className="mt-4 text-center text-sm text-gray-600">
          Click on a project marker to view details. The map will zoom to the
          selected location.
        </div>
      </Container>
    </section>
  );
};

export default FoodSystemsMapSection;
