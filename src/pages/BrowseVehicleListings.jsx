import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import API_ENDPOINTS from "../config/api.js";
// Removed Base64Image import - we render normal <img> elements now
import { RoutePaths } from "../general/RoutePaths.jsx";

const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
const isLikelyUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));
const isLikelyBase64 = (s) =>
  typeof s === "string" &&
  // heuristic: raw base64 payloads tend to be long and use only base64 chars (we allow whitespace)
  s.replace(/\s/g, "").length > 100 && /^[A-Za-z0-9+/=]+$/.test(s.replace(/\s/g, ""));

const buildImageSrcFromValue = (val) => {
  if (!val) return null;

  // 1) If it's already a data URL, use directly
  if (isDataUrl(val)) return val;

  // 2) If it's a plain URL string, use it directly
  if (isLikelyUrl(val)) return val;

  // 3) If it's a raw base64 string (no data: prefix), build a data URL (default to jpeg)
  if (typeof val === "string" && isLikelyBase64(val)) {
    return `data:image/jpeg;base64,${val.trim()}`;
  }

  // 4) If it's an object, try common properties
  if (typeof val === "object") {
    // Prefer explicit data fields
    const base64 = val.imageBase64 ?? val.base64 ?? val.data ?? null;
    if (base64 && isLikelyBase64(base64)) {
      const mime = val.mime || val.contentType || "image/jpeg";
      return `data:${mime};base64,${base64.trim()}`;
    }

    // Prefer provided absolute/relative URL fields
    const url = val.url ?? val.src ?? val.path ?? null;
    if (url && isLikelyUrl(url)) return url;

    // If object has an image id, return the server image endpoint URL (let browser fetch it)
    const imageId = val.imageId ?? val.id ?? val.image_id ?? null;
    if (imageId) {
      // Prefer explicit API endpoint if configured
      if (API_ENDPOINTS?.IMAGES) {
        // If your API supports thumbnails, you can append a query param e.g. ?size=thumb
        return `${API_ENDPOINTS.IMAGES}/${imageId}`;
      }
      // Fallback guess (you should add IMAGES to src/config/api.js)
      return `/api/images/${imageId}`;
    }
  }

  // Nothing usable found
  return null;
};

const BrowseVehicleListings = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicleListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.LISTINGS_BY_VEHICLE}/${vehicleId}`);
        const data = await res.json();

        console.log("Fetched vehicle listings data:", data);

        let parsedListings;
        if (Array.isArray(data)) {
          parsedListings = data;
        } else {
          const listingsData = data.data || data.listings || [];
          parsedListings = Array.isArray(listingsData) ? listingsData : [];
        }

        setListings(parsedListings);
        console.log("Parsed listings:", parsedListings);

        if (data.vehicleDetails) {
          setVehicleDetails(data.vehicleDetails);
        }
      } catch (error) {
        console.error("Error fetching vehicle listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleListings();
    }
  }, [vehicleId]);

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="text-center">
            <p className="text-white text-lg">No vehicle selected.</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-white hover:text-gray-200 font-semibold"
            >
              ← Back
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              Vehicle Listings
            </h1>
            {vehicleDetails && (
              <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                {vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}
              </p>
            )}
            <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
              Browse available listings for this vehicle.
            </p>
          </div>

          {/* Results Section */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4"></div>
                  <p className="text-center text-lg text-gray-600">
                    Loading listings...
                  </p>
                </div>
              ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <p className="text-center text-lg text-gray-600">
                    No listings found for this vehicle.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-700 font-medium">
                      Found <span className="text-blue-600 font-bold">{listings.length}</span> listing{listings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {listings.map((listing, index) => {
                      const firstImage =
                        Array.isArray(listing.images) && listing.images.length
                          ? listing.images[0]
                          : listing.images;
                      const listingIdValue = listing.listingInfoId || listing.listingId || listing.id;
                      // Compute src using helper - this returns data: URLs, absolute/relative URLs, or server image URLs
                      const thumbSrc = buildImageSrcFromValue(firstImage);

                      return (
                        <div
                          key={listingIdValue ?? `listing-${index}`}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4">
                            {thumbSrc ? (
                              <img
                                src={thumbSrc}
                                alt={listing.title ? listing.title : `Listing ${listingIdValue ?? index}`}
                                className="w-full h-48 object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded">
                                No image
                              </div>
                            )}

                            <h3 className="font-semibold text-lg text-gray-800 mb-2">
                              ${listing.price?.toLocaleString() || 'N/A'}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {listing.description || 'Listing'}
                            </p>
                            <p className="text-gray-500 text-xs mb-3">
                              {listing.date ? new Date(listing.date).toLocaleDateString() : 'Date not provided'}
                            </p>
                            <p className="text-sm mb-3">
                              {listing.isAvailable ? (
                                <span className="text-green-600 font-medium">Available</span>
                              ) : (
                                <span className="text-red-600 font-medium">Not available</span>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate(RoutePaths.LISTING_DETAIL.replace(":listingId", listingIdValue))}
                              className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 font-semibold"
                              disabled={!listingIdValue}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* No pagination shown for vehicle-specific listings (endpoint returns an array in current API). */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseVehicleListings;
