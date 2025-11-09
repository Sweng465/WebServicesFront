import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import API_ENDPOINTS from "../config/api.js";
import Base64Image from "../components/Base64Image";

const BrowseVehicleListings = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  // This view uses the vehicle-specific listings endpoint which returns an
  // array of listings. Pagination isn't provided by that endpoint in the
  // current API sample.

  useEffect(() => {
    const fetchVehicleListings = async () => {
      setLoading(true);
      try {
        // Call new vehicle-specific endpoint: /api/listings/vehicle/:id
        const res = await fetch(`${API_ENDPOINTS.LISTINGS_BY_VEHICLE}/${vehicleId}`);
        const data = await res.json();

        console.log("Fetched vehicle listings data:", data);

        // The endpoint returns an array of listing objects (see sample).
        let parsedListings;
        if (Array.isArray(data)) {
          parsedListings = data;
        } else {
          // If backend wraps results or returns pagination, try to normalize
          const listingsData = data.data || data.listings || [];
          parsedListings = Array.isArray(listingsData) ? listingsData : [];
        }

        // Update state with normalized listings and log that normalized value
        setListings(parsedListings);
        console.log("Parsed listings:", parsedListings);

        // If vehicle details are included in response, use them
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
                    {listings.map((listing) => {
                      const firstImage = Array.isArray(listing.images) && listing.images.length ? listing.images[0] : listing.images;
                      return (
                        <div
                          key={listing.listingInfoId}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4">
                            <Base64Image
                              value={firstImage}
                              mime="image/png"
                              alt={`Listing ${listing.listingInfoId}`}
                              className="w-full h-48 object-cover"
                            />
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
                            <button className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 font-semibold">
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
