import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import API_ENDPOINTS from "../config/api.js";
import { RoutePaths } from "../general/RoutePaths.jsx";

const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
const isLikelyUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));
const isLikelyBase64 = (s) =>
  typeof s === "string" &&
  s.replace(/\s/g, "").length > 100 && /^[A-Za-z0-9+/=]+$/.test(s.replace(/\s/g, ""));

const buildImageSrcFromValue = (val) => {
  if (!val) return null;
  if (isDataUrl(val)) return val;
  if (isLikelyUrl(val)) return val;
  if (typeof val === "string" && isLikelyBase64(val)) {
    return `data:image/jpeg;base64,${val.trim()}`;
  }
  if (typeof val === "object") {
    const base64 = val.imageBase64 ?? val.base64 ?? val.data ?? null;
    if (base64 && isLikelyBase64(base64)) {
      const mime = val.mime || val.contentType || "image/jpeg";
      return `data:${mime};base64,${base64.trim()}`;
    }
    const url = val.url ?? val.src ?? val.path ?? null;
    if (url && isLikelyUrl(url)) return url;
    const imageId = val.imageId ?? val.id ?? val.image_id ?? null;
    if (imageId) {
      if (API_ENDPOINTS?.IMAGES) {
        return `${API_ENDPOINTS.IMAGES}/${imageId}`;
      }
      return `/api/images/${imageId}`;
    }
  }
  return null;
};

const BrowsePartListings = () => {
  const { partId } = useParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [partDetails, setPartDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartListings = async () => {
      setLoading(true);
      try {
        // Try a few common endpoints; adapt to whatever backend you have
        let res = await fetch(`${API_ENDPOINTS.LISTINGS}/part/${partId}`);
        if (!res.ok) {
          // fallback to query param style
          res = await fetch(`${API_ENDPOINTS.LISTINGS}?partId=${partId}`);
        }

        const data = await res.json();
        let parsedListings;
        if (Array.isArray(data)) parsedListings = data;
        else parsedListings = Array.isArray(data.data ? data.data : data.listings ? data.listings : [])
          ? data.data || data.listings
          : [];

        setListings(parsedListings || []);

        // Optionally fetch part metadata if API exposes it via PARTS endpoint
        try {
          const pRes = await fetch(`${API_ENDPOINTS.PARTS}/${partId}`);
          if (pRes.ok) {
            const pData = await pRes.json();
            setPartDetails(pData?.data ?? pData);
          }
        } catch (err) {
          void err;
        }
      } catch (error) {
        console.error("Error fetching part listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    if (partId) fetchPartListings();
  }, [partId]);

  if (!partId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="text-center">
            <p className="text-white text-lg">No part selected.</p>
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
          <div className="mb-8 sm:mb-10">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-white hover:text-gray-200 font-semibold"
            >
              ← Back
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
              Part Listings
            </h1>
            {partDetails && (
              <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                {partDetails.name || partDetails.title || `Part ${partId}`}
              </p>
            )}
            <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
              Browse available listings for this part.
            </p>
          </div>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4"></div>
                  <p className="text-center text-lg text-gray-600">Loading listings...</p>
                </div>
              ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <p className="text-center text-lg text-gray-600">No listings found for this part.</p>
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
                      const firstImage = Array.isArray(listing.images) && listing.images.length ? listing.images[0] : listing.images;
                      const listingIdValue = listing.listingInfoId || listing.listingId || listing.id;
                      const thumbSrc = buildImageSrcFromValue(firstImage);

                      return (
                        <div
                          key={listingIdValue ?? `listing-${index}`}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4">
                            {thumbSrc ? (
                              <img src={thumbSrc} alt={listing.title ? listing.title : `Listing ${listingIdValue ?? index}`} className="w-full h-48 object-cover rounded" />
                            ) : (
                              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 rounded">No image</div>
                            )}

                            <h3 className="font-semibold text-lg text-gray-800 mb-2">${listing.price?.toLocaleString() || 'N/A'}</h3>
                            <p className="text-gray-600 text-sm mb-2">{listing.description || 'Listing'}</p>
                            <p className="text-gray-500 text-xs mb-3">{listing.date ? new Date(listing.date).toLocaleDateString() : 'Date not provided'}</p>
                            <p className="text-sm mb-3">
                              {listing.isAvailable ? (
                                <span className="text-green-600 font-medium">Available</span>
                              ) : (
                                <span className="text-red-600 font-medium">Not available</span>
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => navigate(RoutePaths.PART_LISTING_DETAIL.replace(":listingId", listingIdValue))}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowsePartListings;
