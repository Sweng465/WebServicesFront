import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import API_ENDPOINTS from "../config/api.js";

const BrowseVehicleListings = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    const fetchVehicleListings = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page,
          limit: 12,
          vehicleId: vehicleId || "",
        });

        const res = await fetch(`${API_ENDPOINTS.LISTINGS}?${query}`);
        const data = await res.json();

        console.log("Fetched listings data:", data);

        // The backend returns { data: [...], pagination: {...} } or similar structure
        const listingsData = data.data || data.listings || data || [];
        setListings(Array.isArray(listingsData) ? listingsData : []);
        // Normalize pagination from backend to consistent numeric types and keys
        const raw = data.pagination || {};
        const paginationData = {
          page: Number(raw.page || 1),
          pages: Number(raw.pages ?? raw.totalPages ?? 1),
          total: Number(raw.total ?? 0),
          limit: Number(raw.limit ?? 12),
          hasNextPage: !!raw.hasNextPage,
          hasPreviousPage: !!raw.hasPreviousPage,
        };
        console.log("Pagination data:", paginationData);
        setPagination(paginationData);

        // Keep local `page` in sync with backend if backend reports a different page
        if (paginationData.page !== page) {
          setPage(paginationData.page);
        }

        // If vehicle details are included in response, use them
        if (data.vehicleDetails) {
          setVehicleDetails(data.vehicleDetails);
        }
      } catch (error) {
        console.error("Error fetching vehicle listings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleListings();
    }
  }, [vehicleId, page]);

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
                    {listings.map((listing) => (
                      <div
                        key={listing.listingId}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {listing.imageUrl && (
                          <img
                            src={listing.imageUrl}
                            alt={`Listing ${listing.listingId}`}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-lg text-gray-800 mb-2">
                            ${listing.price?.toLocaleString() || 'N/A'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {listing.title || 'Listing'}
                          </p>
                          <p className="text-gray-500 text-xs mb-3">
                            {listing.location || 'Location not specified'}
                          </p>
                          <button className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 font-semibold">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pagination Section */}
            {listings.length > 0 && (
              <div className="border-t border-gray-200 p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <Pagination
                      currentPage={page}
                      setPage={setPage}
                      totalPages={pagination.pages || pagination.totalPages || 1}
                      hasNextPage={pagination.hasNextPage}
                      hasPreviousPage={pagination.hasPreviousPage}
                      total={pagination.total}
                      limit={pagination.limit}
                    />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseVehicleListings;
