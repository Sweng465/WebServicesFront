import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Base64Image from "../components/Base64Image";
import BusinessInfo from "../components/BusinessInfo.jsx";
import API_ENDPOINTS, { buildVehicleDetailUrl } from "../config/api.js";

const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
};

const formatDate = (value) => {
  if (!value) return "Unknown";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Unknown" : parsed.toLocaleDateString();
};

const ListingDetails = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError("Listing id is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_ENDPOINTS.LISTINGS}/${listingId}`);

        if (!res.ok) {
          throw new Error(`Failed to load listing (${res.status})`);
        }

        const data = await res.json();

        // The API may return the listing directly or wrap it in a data object.
        const listingData = data?.data ?? data;
        setListing(listingData ?? null);
      } catch (err) {
        console.error("Error fetching listing detail:", err);
        setError(err.message || "Failed to load listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  useEffect(() => {
    const vehicleId = listing?.vehicle?.vehicleId ?? listing?.vehicleId ?? listing?.itemId;
    if (!vehicleId) {
      setVehicleInfo(null);
      return;
    }

    let cancelled = false;

    setVehicleInfo(null);

    const fetchVehicle = async () => {
      try {
        const res = await fetch(buildVehicleDetailUrl(vehicleId));
        if (!res.ok) throw new Error(`Failed to load vehicle (${res.status})`);
        const data = await res.json();
        const vehicleData = data?.data ?? data;
        if (!cancelled) setVehicleInfo(vehicleData ?? null);
      } catch (err) {
        console.error("Error fetching vehicle info:", err);
      }
    };

    fetchVehicle();

    return () => {
      cancelled = true;
    };
  }, [listing]);

  const imageGallery = useMemo(() => {
    if (!listing) return [];

    const rawImages = Array.isArray(listing.images)
      ? listing.images
      : listing.image
      ? [listing.image]
      : [];

    return rawImages.filter(Boolean);
  }, [listing]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [imageGallery.length]);

  const vehicleSummary = useMemo(() => {
    const source = vehicleInfo || listing?.vehicle;
    if (!source) return "Vehicle information unavailable";

    const extractValue = (value) => {
      if (!value) return null;
      if (typeof value === "string") return value;
      if (typeof value === "number") return value;
      if (typeof value === "object") {
        return value.value || value.name || value.label || value.trim || null;
      }
      return null;
    };

    const name = extractValue(source.name) || extractValue(source.fullName) || extractValue(source.value);
    const parts = [
      extractValue(source.year),
      extractValue(source.make),
      extractValue(source.model),
      extractValue(source.submodel),
      extractValue(source.trim),
    ].filter(Boolean);

    if (name) return name;
    if (parts.length) return parts.join(" · ");
    return "Vehicle information unavailable";
  }, [listing, vehicleInfo]);

  const primaryImage = imageGallery[selectedImageIndex] ?? null;
  const seller = listing?.seller ?? null;
  // const sellerName = seller?.name || seller?.username || listing?.business?.name || "Seller";
  // const sellerPhone = seller?.phone || seller?.phoneNumber || listing?.business?.phoneNumber || null;
  const sellerEmail = seller?.email || listing?.business?.email || null;
  const contactUrl = listing?.contactUrl || (sellerEmail ? `mailto:${sellerEmail}` : null);
  // const sellerType = seller?.type || (listing?.business ? "Business Seller" : seller ? "Individual Seller" : null);
  // const sellerRating = seller?.rating || seller?.averageRating || null;
  // const sellerReviewCount = seller?.reviewCount || seller?.reviewsCount || null;

  const handleAddToCart = () => {
    // Placeholder for cart integration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-white hover:text-gray-200 font-semibold"
            type="button"
          >
            ← Back
          </button>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4" />
                  <p className="text-gray-600 text-lg">Loading listing...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium text-lg">{error}</p>
                </div>
              ) : !listing ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Listing not found.</p>
                </div>
              ) : (
                <div className="space-y-12 lg:space-y-10">
                  <div className="grid gap-8 lg:grid-cols-2 items-start">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                      <div className="relative overflow-hidden bg-gray-100 rounded-xl shadow-lg aspect-w-4 aspect-h-3">
                        {primaryImage ? (
                          <Base64Image
                            value={primaryImage}
                            mime="image/jpeg"
                            alt={listing.title || vehicleSummary}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            No image available
                          </div>
                        )}
                      </div>

                      {imageGallery.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {imageGallery.map((img, index) => (
                            <button
                              key={`${listingId}-thumb-${index}`}
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              className={`relative aspect-w-4 aspect-h-3 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                selectedImageIndex === index
                                  ? "border-blue-600 ring-2 ring-blue-300"
                                  : "border-transparent hover:border-blue-400"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            >
                              <Base64Image
                                value={img}
                                mime="image/jpeg"
                                alt={listing.title ? `${listing.title} thumbnail ${index + 1}` : `Listing thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Listing Info & Actions */}
                    <div className="flex flex-col gap-6">
                      {/* Main Listing Info Card */}
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                          {vehicleSummary}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                          {vehicleInfo?.year && <span>📅 {vehicleInfo.year}</span>}
                          {listing.mileage && <span>🛣️ {listing.mileage.toLocaleString()} miles</span>}
                          {/* Placeholder for distance */}
                          {/* <span>📍 2.3 miles away</span> */}
                        </div>

                        <p className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                          {formatCurrency(Number(listing.price))}
                        </p>

                        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={handleAddToCart}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                          >
                            🛒 Add to Cart
                          </button>
                          {contactUrl ? (
                            <a
                              href={contactUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100"
                            >
                              📞 Contact Seller
                            </a>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-400"
                            >
                              📞 Contact Seller
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Seller Info Card - This is now handled by BusinessInfo or can be re-added if needed */}
                      {/* <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"> ... </div> */}

                      <BusinessInfo
                        businessId={listing.business?.businessId ?? listing.businessId ?? listing.businessID}
                        fallbackBusiness={listing.business}
                        className="shadow-md rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Description Section */}
                  {listing.description && (
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                        <p className="text-sm text-gray-500">
                          Listed on: {formatDate(listing.date)}
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {listing.description}
                      </p>
                    </section>
                  )}

                  {/* Available Parts Section (Placeholder) */}
                  {/* This section can be built out later with its own component and data fetching */}
                  <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Parts from this Car</h2>
                    <div className="text-center text-gray-500 py-8">
                      <p>Part listings are not yet implemented.</p>
                    </div>
                  </section>          
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;
