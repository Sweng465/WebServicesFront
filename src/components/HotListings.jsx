import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import API_ENDPOINTS from "../config/api.js";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Base64Image from "./Base64Image.jsx";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 sm:p-4 shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Previous slide"
  >
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 sm:p-4 shadow-xl transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label="Next slide"
  >
    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const HotListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch first 5 listings from /listings/vehicle
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page: 1, limit: 5 });
        const res = await fetch(`${API_ENDPOINTS.LISTINGS_BY_VEHICLE}?${query}`);
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.listings)
              ? data.listings
              : [];
        setListings(list.slice(0, 5));
      } catch (err) {
        console.error("Error fetching hot listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleCardClick = (listing) => {
    const listingId = listing.listingInfoId;
    if (!listingId) {
      console.error("No listing ID found:", listing);
      return;
    }
    navigate(RoutePaths.LISTING_DETAIL.replace(":listingId", listingId));
  };

  // Build title from vehicle or listing data
  const getTitle = (listing) => {
    if (listing?.value && typeof listing.value === "string" && listing.value.trim()) {
      return listing.value;
    }
    const v = listing.vehicle || listing;
    const year = v?.year?.value || v?.yearValue || "";
    const make = v?.make?.value || v?.makeValue || "";
    const model = v?.model?.value || v?.modelValue || "";
    return [year, make, model].filter(Boolean).join(" ") || "Vehicle Listing";
  };

  const getPrice = (listing) => {
    const price = listing.price ?? listing.askingPrice;
    if (price == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageValue = (listing) => {
    let rawBase64 = null;
    if (Array.isArray(listing?.images) && listing.images.length > 0) {
      rawBase64 = listing.images[0]?.imageBase64 ?? null;
    }
    if (!rawBase64) {
      rawBase64 = listing?.imageBase64 ?? listing?.base64image ?? listing?.vehicle?.imageBase64 ?? null;
    }
    if (typeof rawBase64 === "string" && rawBase64.trim()) {
      const s = rawBase64.trim();
      if (s.startsWith("data:")) {
        return s;
      } else {
        const cleaned = s.replace(/\s+/g, "");
        if (cleaned.length > 50) {
          return `data:image/jpeg;base64,${cleaned}`;
        }
      }
    }
    return listing?.imageUrl ?? listing?.image ?? listing?.vehicle?.imageUrl ?? listing?.vehicle?.image ?? null;
  };

  // Slick settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "15%",
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "10%",
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerPadding: "5%",
        },
      },
    ],
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-3 mt-6">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-3 h-3 rounded-full bg-white/40 hover:bg-white/60 transition-all duration-300 focus:outline-none" />
    ),
  };

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pt-0 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              <span className="fire-text">Hot</span> Listings
            </h2>
            <p className="text-gray-100 text-sm sm:text-base">
              Check out our most popular vehicles right now
            </p>
          </div>
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-orange-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 pt-0 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              <span className="fire-text">Hot</span> Listings
            </h2>
            <p className="text-gray-100 text-sm sm:text-base">
              Check out our most popular vehicles right now
            </p>
          </div>
          <p className="text-center text-gray-200">No listings available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-0 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            <span className="fire-text">Hot</span> Listings
          </h2>
          <p className="text-gray-100 text-sm sm:text-base">
            Check out our most popular vehicles right now
          </p>
        </div>

        {/* Slick Carousel */}
        <div className="hot-listings-carousel">
          <Slider {...settings}>
            {listings.map((listing, index) => {
              const listingId = listing.listingInfoId || listing.vehicleListingId || listing.listingId || listing.id;
              const imageValue = getImageValue(listing);
              return (
                <div key={listingId || index} className="px-2">
                  <div
                    onClick={() => handleCardClick(listing)}
                    className="relative bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer mx-auto"
                  >
                    {/* Image */}
                    <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {imageValue ? (
                        <Base64Image
                          value={imageValue}
                          mime="image/jpeg"
                          alt={getTitle(listing)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
                          <svg
                            className="w-24 h-24 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {/* Hot badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                        <span className="fire-text-sm">Hot</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                        {getTitle(listing)}
                      </h3>
                      {getPrice(listing) && (
                        <p className="text-2xl sm:text-3xl font-extrabold text-orange-300 drop-shadow-lg">
                          {getPrice(listing)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      {/* Custom styles for slick dots and fire text */}
      <style>{`
        .fire-text {
          background: linear-gradient(180deg, #fff 0%, #ff9500 25%, #ff5e00 50%, #ff0000 75%, #8b0000 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fire-flicker 1.5s ease-in-out infinite alternate;
          text-shadow: 0 0 10px rgba(255, 100, 0, 0.5);
          filter: drop-shadow(0 0 8px rgba(255, 100, 0, 0.6));
        }
        .fire-text-sm {
          background: linear-gradient(180deg, #fff 0%, #ffcc00 30%, #ff6600 60%, #ff3300 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fire-flicker 1s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 4px rgba(255, 100, 0, 0.8));
        }
        @keyframes fire-flicker {
          0% {
            filter: drop-shadow(0 0 6px rgba(255, 100, 0, 0.6)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(255, 50, 0, 0.8)) brightness(1.1);
          }
          100% {
            filter: drop-shadow(0 0 8px rgba(255, 150, 0, 0.7)) brightness(1.05);
          }
        }
        .hot-listings-carousel .slick-dots li button:before {
          display: none;
        }
        .hot-listings-carousel .slick-dots li.slick-active button {
          width: 2.5rem;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .hot-listings-carousel .slick-slide {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hot-listings-carousel .slick-slide:not(.slick-center) {
          transform: scale(0.9);
          opacity: 0.7;
        }
        .hot-listings-carousel .slick-center {
          transform: scale(1);
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default HotListings;
