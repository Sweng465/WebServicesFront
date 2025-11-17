import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import API_ENDPOINTS, { buildBusinessDetailUrl } from "../config/api.js";
import Base64Image from "../components/Base64Image.jsx";
import VehicleResultCard from "../components/vehicle/VehicleResultCard";
import { RoutePaths } from "../general/RoutePaths.jsx";

// Image helper: copied/adapted from BrowseVehicleListings.jsx
const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
const isLikelyUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));
const isLikelyBase64 = (s) =>
  typeof s === "string" &&
  s.replace(/\s/g, "").length > 100 &&
  /^[A-Za-z0-9+/=]+$/.test(s.replace(/\s/g, ""));

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

const formatPhoneNumber = (value) => {
  if (value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
};

const BusinessDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const rawId = params.id ?? params.businessId ?? null;

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [imageGallery, setImageGallery] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // listings state
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  const numericId = (() => {
    if (rawId === null || rawId === undefined) return null;
    if (Number.isInteger(rawId)) return rawId;
    const n = parseInt(String(rawId).trim(), 10);
    return Number.isInteger(n) && n > 0 ? n : null;
  })();

  useEffect(() => {
    if (numericId === null) {
      setError(new Error("Missing or invalid business id in URL."));
      setBusiness(null);
      return;
    }

    let cancelled = false;
    const fetchBusiness = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = typeof buildBusinessDetailUrl === "function"
          ? buildBusinessDetailUrl(numericId)
          : `${API_ENDPOINTS.BUSINESSES}/${numericId}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load business (${res.status})`);
        const data = await res.json();
        const normalized = data?.data ?? data ?? null;
        if (!cancelled) setBusiness(normalized);
      } catch (err) {
        console.error("Error fetching business details:", err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBusiness();
    return () => { cancelled = true; };
  }, [numericId]);

  // Fetch listings for this business (server endpoint or query param)
  useEffect(() => {
    if (!numericId) {
      setListings([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setListingsLoading(true);
      try {
        // Build URL for /listings/business/:id (try config first, then try removing "/api", then fallback)
        const url = (() => {
          if (API_ENDPOINTS.LISTING_BY_BUSINESS) {
            return API_ENDPOINTS.LISTING_BY_BUSINESS.replace(":businessId", numericId);
          }

          if (API_ENDPOINTS.LISTINGS) {
            // API_ENDPOINTS.LISTINGS is usually like `${API_BASE_URL}/api/listings`.
            // Remove the "/api" prefix so we call `${API_BASE_URL}/listings/business/:id`.
            try {
              return API_ENDPOINTS.LISTINGS.replace("/api", "") + `/business/${numericId}`;
            } catch {
              return `${API_ENDPOINTS.LISTINGS}/business/${numericId}`;
            }
          }

          // Last resort: relative path (will call same origin)
          return `/listings/business/${numericId}`;
        })();

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load listings (${res.status})`);
        const data = await res.json();

        // Accept common response shapes
        const rawItems = data?.data ?? data?.listings ?? (Array.isArray(data) ? data : []);
        const itemsArray = Array.isArray(rawItems) ? rawItems : [];
        console.log("Fetched listings for business:", itemsArray);

        if (!cancelled) setListings(itemsArray);
      } catch (err) {
        console.error("Error fetching listings for business:", err);
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setListingsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [numericId]);

  // Build image gallery from business record
  useEffect(() => {
    if (!business) {
      setImageGallery([]);
      return;
    }

    const rawImages = Array.isArray(business.images)
      ? business.images
      : business.image
      ? [business.image]
      : business.imagesList
      ? business.imagesList
      : business.logo
      ? [business.logo]
      : business.logoUrl
      ? [business.logoUrl]
      : [];

    setImageGallery(rawImages.filter(Boolean));
    setSelectedImageIndex(0);
  }, [business]);

  // Resolve selected image into usable src (for business hero)
  useEffect(() => {
    let currentObjectUrl = null;

    const revoke = () => {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
      }
    };

    const load = async () => {
      setImageSrc(null);
      const primary = imageGallery[selectedImageIndex] ?? null;
      if (!primary) return setImageSrc(null);

      try {
        const src = buildImageSrcFromValue(primary);
        if (src) {
          setImageSrc(src);
          return;
        }
      } catch (err) {
        console.warn("Error resolving image source:", err);
      }

      setImageSrc(null);
    };

    load();
    return () => { revoke(); };
  }, [imageGallery, selectedImageIndex]);

  // Minimal normalizer used when mapping listing -> vehicle
  const normalizeImageCandidate = (candidate) => {
    if (!candidate) return { imageBase64: null, imageUrl: null, image: null };

    const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
    const isLikelyUrl = (s) => typeof s === "string" && (s.startsWith("http") || s.startsWith("/") || s.startsWith("./") || s.startsWith("../"));
    const isLikelyBase64 = (s) => typeof s === "string" && s.length > 30 && /^[A-Za-z0-9+/=\s]+$/.test(s.replace(/\s/g, "").slice(0, 200));

    // string
    if (typeof candidate === "string") {
      const s = candidate.trim();
      if (isDataUrl(s)) return { imageBase64: s, imageUrl: null, image: s };
      if (isLikelyUrl(s)) return { imageBase64: null, imageUrl: s, image: s };
      if (isLikelyBase64(s)) return { imageBase64: s, imageUrl: null, image: s };
      return { imageBase64: null, imageUrl: s, image: s };
    }

    // numeric (id)
    if (typeof candidate === "number" || (typeof candidate === "string" && /^\d+$/.test(candidate.trim()))) {
      const id = String(candidate).trim();
      const url = API_ENDPOINTS.IMAGES ? `${API_ENDPOINTS.IMAGES}/${id}` : `/api/images/${id}`;
      return { imageBase64: null, imageUrl: url, image: url };
    }

    // object
    if (typeof candidate === "object") {
      const base64 =
        (typeof candidate.tipImageBase64 === "string" && candidate.tipImageBase64) ??
        (typeof candidate.tip_image_base64 === "string" && candidate.tip_image_base64) ??
        (typeof candidate.imageBase64 === "string" && candidate.imageBase64) ??
        (typeof candidate.base64 === "string" && candidate.base64) ??
        (typeof candidate.data === "string" && candidate.data) ??
        null;
      if (base64) {
        const s = base64.trim();
        return { imageBase64: s, imageUrl: null, image: s };
      }

      const url =
        (typeof candidate.imageUrl === "string" && candidate.imageUrl) ??
        (typeof candidate.url === "string" && candidate.url) ??
        (typeof candidate.src === "string" && candidate.src) ??
        (typeof candidate.path === "string" && candidate.path) ??
        (typeof candidate.thumbnail === "string" && candidate.thumbnail) ??
        null;
      if (url) {
        return { imageBase64: null, imageUrl: url.trim(), image: url.trim() };
      }

      const possibleId = candidate.imageId ?? candidate.id ?? candidate.image_id ?? candidate.fileId ?? candidate.mediaId ?? null;
      if ((typeof possibleId === "number" && !Number.isNaN(possibleId)) || (typeof possibleId === "string" && /^\d+$/.test(String(possibleId).trim()))) {
        const id = String(possibleId).trim();
        const url2 = API_ENDPOINTS.IMAGES ? `${API_ENDPOINTS.IMAGES}/${id}` : `/api/images/${id}`;
        return { imageBase64: null, imageUrl: url2, image: url2 };
      }

      // binary arrays -> Uint8Array
      if (Array.isArray(candidate.data) && candidate.data.length > 0 && typeof candidate.data[0] === "number") {
        return { imageBase64: null, imageUrl: null, image: new Uint8Array(candidate.data) };
      }
      if (candidate.data && (candidate.data instanceof Uint8Array || candidate.data instanceof ArrayBuffer)) {
        return { imageBase64: null, imageUrl: null, image: candidate.data };
      }

      // nested images array
      if (Array.isArray(candidate.images) && candidate.images.length > 0) {
        return normalizeImageCandidate(candidate.images[0]);
      }
      const nested = candidate.image ?? candidate.firstImage ?? candidate[0] ?? null;
      if (nested) return normalizeImageCandidate(nested);

      // last resort leave whole object for Base64Image to handle
      return { imageBase64: null, imageUrl: null, image: candidate };
    }

    return { imageBase64: null, imageUrl: null, image: null };
  };

  // Map a listing object into the vehicle shape expected by VehicleResultCard
  const mapListingToVehicle = (l) => {
    const vehicle = l.vehicle ?? {};
    const vehicleId = vehicle.vehicleId ?? l.vehicleId ?? l.itemId ?? l.listingId ?? l.id ?? l._id;

    const title =
      l.title ??
      l.name ??
      l.listingTitle ??
      vehicle.value ??
      vehicle.name ??
      [vehicle.make?.value ?? vehicle.make, vehicle.model?.value ?? vehicle.model].filter(Boolean).join(" ");

    const year = vehicle.year ? (typeof vehicle.year === "object" ? vehicle.year : { value: vehicle.year }) : (l.year ? { value: l.year } : undefined);
    const make = vehicle.make ? (typeof vehicle.make === "object" ? vehicle.make : { value: vehicle.make }) : (l.make ? { value: l.make } : undefined);

    // pick candidate from several common keys (including tipImageBase64)
    const candidate =
      vehicle?.tipImageBase64 ??
      vehicle?.tip_image_base64 ??
      vehicle.image ??
      vehicle.imageUrl ??
      vehicle.logo ??
      vehicle.thumbnail ??
      (Array.isArray(vehicle.images) ? vehicle.images[0] : null) ??
      l.tipImageBase64 ??
      l.tip_image_base64 ??
      l.image ??
      l.imageUrl ??
      l.thumbnail ??
      (Array.isArray(l.images) ? l.images[0] : null) ??
      null;

    const { imageBase64, imageUrl, image } = normalizeImageCandidate(candidate);

    return {
      vehicleId,
      value: title ?? null,
      year,
      make,
      description: l.shortDescription ?? l.summary ?? l.description ?? vehicle.description ?? null,
      imageBase64: imageBase64 ?? null,
      imageUrl: imageUrl ?? null,
      image: image ?? imageUrl ?? imageBase64 ?? null,
    };
  };

  if (!numericId) {
    return (
      <div>
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
            <p className="text-red-600">Invalid business id in the URL.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600">Go back</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-6xl xl:max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="mb-6 text-white hover:text-gray-200 font-semibold" type="button">
            ← Back
          </button>

          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4" />
                  <p className="text-gray-600 text-lg">Loading business...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium text-lg">{error.message ?? String(error)}</p>
                </div>
              ) : !business ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Business not found.</p>
                </div>
              ) : (
                <div className="space-y-12 lg:space-y-10">
                  <div className="grid gap-8 lg:grid-cols-2 items-start">
                    {/* Image gallery */}
                    <div className="space-y-4">
                      <div className="relative overflow-hidden bg-gray-100 rounded-xl shadow-lg aspect-w-4 aspect-h-3">
                        <Base64Image
                          value={imageSrc ?? (imageGallery[selectedImageIndex] ?? null)}
                          mime="image/jpeg"
                          alt={business.name || "Business image"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {imageGallery.length > 1 && (
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                          {imageGallery.map((img, index) => (
                            <button
                              key={`biz-${numericId}-thumb-${index}`}
                              type="button"
                              onClick={() => setSelectedImageIndex(index)}
                              className={`relative aspect-w-4 aspect-h-3 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                selectedImageIndex === index ? "border-blue-600 ring-2 ring-blue-300" : "border-transparent hover:border-blue-400"
                              }`}
                              aria-label={`View image ${index + 1}`}
                            >
                              <Base64Image
                                value={img}
                                mime={img?.mime ?? "image/jpeg"}
                                alt={`thumb ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Business Info & Actions (inlined) */}
                    <div className="flex flex-col gap-6">
                      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{business.name}</h1>

                        <div className="mt-2 text-sm text-gray-500">
                          {business.location && <span>{business.location}</span>}
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {business.website ? (
                            <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100">
                              🌐 Visit Website
                            </a>
                          ) : (
                            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-400">
                              🌐 No website
                            </div>
                          )}

                          {business.email ? (
                            <a href={`mailto:${business.email}`} className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100">
                              ✉️ Email
                            </a>
                          ) : (
                            <div className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-400">
                              ✉️ No contact email
                            </div>
                          )}
                        </div>

                        <div className="mt-4 text-sm text-gray-700 space-y-2">
                          {business.phoneNumber ?? business.phone ?? business.contactNumber ? (
                            <p><span className="font-semibold">Phone:</span> {formatPhoneNumber(business.phoneNumber ?? business.phone ?? business.contactNumber)}</p>
                          ) : null}
                          {business.isPullYourself !== undefined && (
                            <p><span className="font-semibold">Pull-It-Yourself:</span> {business.isPullYourself ? "Yes" : "No"}</p>
                          )}
                          {business.address && <p><span className="font-semibold">Address:</span> {business.address}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  {business.description && (
                    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">About</h2>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{business.description}</p>
                    </section>
                  )}

                  {/* Listings Section */}
                  <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Listings</h2>
                      <p className="text-sm text-gray-600">Found <span className="font-semibold text-blue-600">{listings.length}</span></p>
                    </div>

                    {listingsLoading ? (
                      <div className="py-8 text-center text-gray-600">Loading listings…</div>
                    ) : listings.length === 0 ? (
                      <div className="py-8 text-center text-gray-600">No listings available.</div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {listings.map((l, idx) => {
                            // common image candidate shapes (array first, single field, thumbnail)
                            const firstImage =
                              Array.isArray(l.images) && l.images.length
                                ? l.images[0]
                                : l.images ?? l.image ?? l.thumbnail ?? null;

                            // compute a usable src (data: URL, absolute/relative URL, or server image endpoint)
                            const thumbSrc = buildImageSrcFromValue(firstImage);

                            // map listing -> vehicle
                            const vehicle = mapListingToVehicle(l);

                            // attach computed thumbnail when available (don't override existing mapped fields)
                            if (thumbSrc) {
                              console.debug("BusinessDetails thumbSrc:", thumbSrc, "for listing:", l.listingId ?? l.id ?? idx);
                              vehicle.imageUrl = vehicle.imageUrl ?? thumbSrc;
                              vehicle.image = vehicle.image ?? thumbSrc;
                              // if it's a data: URL, Base64Image component will handle it fine
                            } else {
                              // fallback: try the normalizeImageCandidate to extract anything we missed
                              const candidate = l.image ?? (Array.isArray(l.images) ? l.images[0] : null);
                              const normalized = normalizeImageCandidate(candidate);
                              vehicle.imageBase64 = vehicle.imageBase64 ?? normalized.imageBase64;
                              vehicle.imageUrl = vehicle.imageUrl ?? normalized.imageUrl;
                              vehicle.image = vehicle.image ?? normalized.image;
                            }

                            const listingIdValue = l.listingInfoId ?? l.listingId ?? l.id ?? l._id ?? null;
                            const actionPath = listingIdValue ? RoutePaths.LISTING_DETAIL.replace(":listingId", listingIdValue) : null;

                            return (
                              <div key={l.listingId ?? l.id ?? l._id ?? idx}>
                                <VehicleResultCard
                                  vehicle={vehicle}
                                  variant="grid"
                                  size="small"
                                  actionPath={actionPath}
                                  actionText="View Details"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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

export default BusinessDetails;
