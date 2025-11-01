import { useState, useEffect } from "react";
import VehicleCard from "./VehicleCard";

import hotListingFrame1 from "../assets/hot-listing-frame-1.png";
import hotListingFrame2 from "../assets/hot-listing-frame-2.png";
import hotListingFrame3 from "../assets/hot-listing-frame-3.png";

const vehicleListings = [
  {
    id: 1,
    image: hotListingFrame1,
    title: "2002 Ford Ranger",
  },
  {
    id: 2,
    image: hotListingFrame2,
    title: "1999 Mazda Miata",
  },
  {
    id: 3,
    image: hotListingFrame3,
    title: "2003 Dodge SRT-4",
  },
  {
    id: 4,
    image: hotListingFrame1,
    title: "2005 Honda Civic",
  },
  {
    id: 5,
    image: hotListingFrame2,
    title: "2001 Toyota Corolla",
  },
  {
    id: 6,
    image: hotListingFrame3,
    title: "2004 Nissan Altima",
  },
  {
    id: 7,
    image: hotListingFrame1,
    title: "2006 Ford Focus",
  },
  {
    id: 8,
    image: hotListingFrame2,
    title: "2003 Mazda6",
  },
  {
    id: 9,
    image: hotListingFrame3,
    title: "2007 Honda Accord",
  },
  {
    id: 10,
    image: hotListingFrame1,
    title: "2002 Toyota Camry",
  },
];

const HotListings = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  // Update items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % vehicleListings.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? vehicleListings.length - 1 : prev - 1
    );
  };

  // Get visible items
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsToShow; i++) {
      items.push(vehicleListings[(currentIndex + i) % vehicleListings.length]);
    }
    return items;
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            🔥 Hot Listings
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Check out our most popular vehicles right now
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Items Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[400px] sm:min-h-[450px]">
            {getVisibleItems().map((vehicle) => (
              <div
                key={vehicle.id}
                className="transition-all duration-500 ease-out transform"
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 sm:-left-6 lg:-left-8 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 hover:text-blue-700 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-4 sm:-right-6 lg:-right-8 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-600 hover:text-blue-700 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hidden sm:flex items-center justify-center"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8 sm:mt-10">
          {vehicleListings.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-8 sm:w-10"
                  : "bg-white bg-opacity-50 w-2 sm:w-2.5 hover:bg-opacity-75"
              } h-2 sm:h-2.5 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="text-center text-gray-100 text-sm mt-4 sm:mt-6">
          Showing {currentIndex + 1} - {currentIndex + itemsToShow} of{" "}
          {vehicleListings.length} listings
        </p>
      </div>
    </section>
  );
};

export default HotListings;
