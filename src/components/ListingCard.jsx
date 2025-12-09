import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Base64Image from "./Base64Image";

export default function ListingCard({ listing = {}, thumbSrc = null, variant = "grid", size = "small" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    const id =
      listing?.listingId ?? listing?.listingInfoId ?? listing?.id ?? listing?._id ?? listing?.listing_id ?? null;

    if (!id) {
      console.warn("Listing has no id, cannot navigate:", listing);
      return;
    }

    navigate(RoutePaths.LISTING_DETAIL.replace(":listingId", String(id)));
  };

  const firstTruthy = (...vals) => {
    for (const v of vals) {
      if (v === undefined || v === null) continue;
      if (typeof v === "string") {
        if (v.trim() !== "") return v;
      } else {
        return v;
      }
    }
    return null;
  };

  const stripWhitespace = (s) => (typeof s === "string" ? s.replace(/\s+/g, "") : s);

  const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");
  const isLikelyUrl = (s) =>
    typeof s === "string" &&
    (/^https?:\/\//i.test(s) || (s.startsWith("/") && !isLikelyBase64(s)));

  const isLikelyBase64 = (s) =>
    typeof s === "string" &&
    // many base64 images are long; require some minimum length to avoid false positives
    s.replace(/\s/g, "").length > 100 &&
    /^[A-Za-z0-9+/=\s]+$/.test(s.replace(/\s/g, "").slice(0, 200));

  // Normalize a raw base64-like string into a data: URL.
  // If it's already a data URL or http(s)/absolute URL, return as-is.
  function normalizeToDataUrl(value) {
    if (typeof value !== "string") return value;
    const s = value.trim();

    if (s === "") return s;
    if (isDataUrl(s) || isLikelyUrl(s)) return s;

    // Heuristic for base64: if it looks like base64, convert to data: URL
    if (isLikelyBase64(s)) {
      const cleaned = stripWhitespace(s);
      // Try to detect JPEG/PNG by common base64 signatures
      // JPEG often starts with '/9j/' when not prefixed; PNG starts with 'iVBOR'
      let mime = "image/jpeg";
      const prefix = cleaned.slice(0, 8);
      if (/^iVBOR/i.test(prefix)) mime = "image/png";
      if (/^R0lGOD/i.test(prefix)) mime = "image/gif";
      // default fallback mime remains image/jpeg
      return `data:${mime};base64,${cleaned}`;
    }

    // Not recognized — pass through (Base64Image will further normalize)
    return s;
  }

  // Build image candidates: prefer listing.images array -> listing.image -> listing.imageUrl
  const imageGallery = Array.isArray(listing?.images)
    ? listing.images.filter(Boolean)
    : listing?.image
    ? [listing.image]
    : listing?.imageUrl
    ? [listing.imageUrl]
    : [];

  // Start with the first gallery item (if any)
  let primary = imageGallery.length > 0 ? imageGallery[0] : null;

  // If nothing found yet, check common fallback fields
  if (!primary) {
    primary =
      listing?.topImageBase64 ??
      listing?.top_image_base64 ??
      listing?.imageBase64 ??
      listing?.image_base64 ??
      listing?.imageUrl ??
      listing?.image ??
      listing?.thumbnail ??
      null;
  }

  // If primary is an object, try to extract a string candidate from common keys
  if (primary && typeof primary === "object" && !Array.isArray(primary)) {
    primary =
      firstTruthy(
        primary.imageBase64,
        primary.base64,
        primary.data,
        primary.dataUrl,
        primary.url,
        primary.src,
        primary.path,
        primary.image,
        primary.thumbnail
      ) ?? primary;
  }

  // Resolve finalImage: ensure raw base64 strings are converted to data: URLs
  let finalImage = null;

  // Normalize thumbSrc (explicit override) as well
  if (typeof thumbSrc === "string" && thumbSrc.trim()) {
    finalImage = normalizeToDataUrl(thumbSrc);
  } else if (typeof primary === "string" && primary.trim()) {
    finalImage = normalizeToDataUrl(primary);
  } else if (primary) {
    // primary is object or other shape — pass through so Base64Image can handle it
    finalImage = primary;
  }

  const altText = listing?.title || "Listing Image";

  const listSizes =
    size === "large"
      ? { card: "flex gap-4 p-4", img: "w-40 h-28", title: "text-lg", meta: "text-sm", btn: "py-3 text-base" }
      : { card: "flex gap-3 p-3", img: "w-32 h-24", title: "text-base", meta: "text-xs", btn: "py-2 text-sm" };

  if (variant === "list") {
    return (
      <div
        key={listing.id ?? listing._id ?? listing.listingId}
        className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${listSizes.card}`}
      >
        {finalImage ? (
          <div className={`${listSizes.img} flex-shrink-0`}>
            <Base64Image
              value={finalImage}
              mime="image/jpeg"
              alt={altText}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className={`${listSizes.img} bg-gray-200 flex items-center justify-center rounded flex-shrink-0`}>
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${listSizes.title} truncate`}>{listing.value ?? listing.title}</p>
          <p className={`text-blue-600 font-semibold mt-1 ${listSizes.meta}`}>
            {listing?.price != null ? `$${listing.price}` : ""}
          </p>
          <div className="mt-2">
            <button
              onClick={handleClick}
              className={`w-full bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition ${listSizes.btn}`}
              aria-label="View listing details"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={listing.id ?? listing._id ?? listing.listingId}
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-4">
        {finalImage ? (
          <Base64Image
            value={finalImage}
            mime="image/jpeg"
            alt={altText}
            className="w-full h-48 object-cover rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}

        <p className="text-gray-600 font-bold mt-2">{listing.value}</p>
        <p className="text-blue-600 font-semibold mt-2">
          {listing?.price != null ? `$${listing.price}` : ""}
        </p>

        <div className="mt-4">
          <button
            onClick={handleClick}
            className="w-full py-3 px-6 text-lg font-bold bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition ease-in-out duration-150"
            aria-label="View listing details"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}