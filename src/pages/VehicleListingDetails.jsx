import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
// remove/keep Base64Image import depending on thumbnail decision
// import Base64Image from "../components/Base64Image";
import BusinessInfo from "../components/BusinessInfo.jsx";
import API_ENDPOINTS, { buildVehicleDetailUrl } from "../config/api.js";
//import { getCart, saveCart } from "../utils/cart.js";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { useAuth } from "../context/useAuth";

const formatCurrency = (value) => {
  if (typeof value !== "number") return "N/A";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD" });
};

const formatDate = (value) => {
  if (!value) return "Unknown";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "Unknown" : parsed.toLocaleDateString();
};

const VehicleListingDetails = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vehicleInfo, setVehicleInfo] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { user, cart, updateCart } = useAuth(); // pull in authFetch from context

  // NEW: source URL/objectURL for the currently selected image
  const [imageSrc, setImageSrc] = useState(null);

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

  const primaryImage = imageGallery[selectedImageIndex] ?? null;

  // NEW: resolve the primaryImage into a usable src (data URL, absolute/relative URL, or object URL from a fetched blob)
  useEffect(() => {
    let cancelled = false;
    let currentObjectUrl = null;

    const revoke = () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
      }
    };

    const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
    const isLikelyUrl = (s) => typeof s === "string" && (s.startsWith("http") || s.startsWith("/"));
    const isLikelyBase64 = (s) =>
      typeof s === "string" &&
      // quick heuristic: base64 blobs are long and only contain base64 chars (we check length)
      s.length > 100 && /^[A-Za-z0-9+/=\s]+$/.test(s.replace(/\s/g, "").slice(0, 200));

    const load = async () => {
      setImageSrc(null);

      if (!primaryImage) return;

      // 1) If it's already a data URL, use directly
      if (isDataUrl(primaryImage)) {
        setImageSrc(primaryImage);
        return;
      }

      // 2) If it's a plain URL string, use it directly (browser will request it)
      if (isLikelyUrl(primaryImage)) {
        setImageSrc(primaryImage);
        return;
      }

      // 3) If it's a raw base64 string (no data: prefix), build a data URL
      if (typeof primaryImage === "string" && isLikelyBase64(primaryImage)) {
        // you can change the mime if server provides it; default to jpeg
        const dataUrl = `data:image/jpeg;base64,${primaryImage.trim()}`;
        setImageSrc(dataUrl);
        return;
      }

      // 4) If it's an object with a base64 field, use that
      if (typeof primaryImage === "object") {
        const base64 = primaryImage.imageBase64 ?? primaryImage.base64 ?? primaryImage.data ?? null;
        if (base64 && isLikelyBase64(base64)) {
          const mime = primaryImage.mime || primaryImage.contentType || "image/jpeg";
          setImageSrc(`data:${mime};base64,${base64.trim()}`);
          return;
        }

        // 5) If it's an object with an external URL field use it
        const url = primaryImage.url ?? primaryImage.src ?? primaryImage.path ?? null;
        if (url) {
          setImageSrc(url);
          return;
        }

        // 6) If it's an object with an image id, fetch the binary and create an object URL
        const imageId = primaryImage.imageId ?? primaryImage.id ?? primaryImage.image_id ?? null;
        if (imageId) {
          try {
            // Ensure your API exposes an image endpoint; see note below if it doesn't exist.
            const imageUrl = API_ENDPOINTS.IMAGES
              ? `${API_ENDPOINTS.IMAGES}/${imageId}`
              : `/api/images/${imageId}`; // fallback guess
            const res = await fetch(imageUrl);
            if (!res.ok) throw new Error(`Image fetch failed (${res.status})`);
            const blob = await res.blob();
            if (cancelled) return;
            currentObjectUrl = URL.createObjectURL(blob);
            setImageSrc(currentObjectUrl);
            return;
          } catch (err) {
            console.warn("Failed to fetch image blob:", err);
            // fallthrough to placeholder
          }
        }
      }

      // If we get here, we couldn't get an image source
      setImageSrc(null);
    };

    load();

    return () => {
      cancelled = true;
      revoke();
    };
  }, [primaryImage]);

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

  const seller = listing?.seller ?? null;
  // const sellerName = seller?.name || seller?.username || listing?.business?.name || "Seller";
  // const sellerPhone = seller?.phone || seller?.phoneNumber || listing?.business?.phoneNumber || null;
  const sellerEmail = seller?.email || listing?.business?.email || null;
  const contactUrl = listing?.contactUrl || (sellerEmail ? `mailto:${sellerEmail}` : null);
  // const sellerType = seller?.type || (listing?.business ? "Business Seller" : seller ? "Individual Seller" : null);
  // const sellerRating = seller?.rating || seller?.averageRating || null;
  // const sellerReviewCount = seller?.reviewCount || seller?.reviewsCount || null;

const handleAddToCart = () => {
  if (!listing) return;
  if (!user) {
    navigate(RoutePaths.SIGNIN);
    return;
  }

  const existing = cart.find((c) => c.listingId === Number(listingId));

  if (existing) {
    alert("Error: This item is already in your cart.");
  } else {
    const updatedCart = [
      ...cart,
      { listingId: Number(listingId) },
    ];
    updateCart(updatedCart); // update context and localStorage internally
    alert("Added to cart!");
  }
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
                        {imageSrc ? (
                          <img
                            src={imageSrc}
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
                              {/* For thumbnails you can either:
                                  - use the same fetch->objectURL logic, or
                                  - reuse an existing Base64Image component if thumbnails may be base64.
                                For simplicity here we'll just use an img with a small src resolution if available.
                              */}
                              {typeof img === "string" ? (
                                <img src={img} alt={`thumb ${index + 1}`} className="h-full w-full object-cover" />
                              ) : img?.url ? (
                                <img src={img.url} alt={`thumb ${index + 1}`} className="h-full w-full object-cover" />
                              ) : img?.imageBase64 || img?.base64 ? (
                                <img src={`data:${img.mime ?? "image/jpeg"};base64,${img.imageBase64 ?? img.base64}`} alt={`thumb ${index + 1}`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400">—</div>
                              )}
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

export default VehicleListingDetails;
