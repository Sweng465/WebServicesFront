import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../general/RoutePaths.jsx";
import Base64Image from "../Base64Image";
import hotListingFrame1 from "../../assets/hot-listing-frame-1.png";

const DEFAULT_PLACEHOLDER = hotListingFrame1;

const VehicleResultCard = ({
  vehicle = {},
  variant = "grid",
  size = "small",

  // From first file
  actionPath = null,
  actionText = null,

  // From second file
  onSelect = null,
  showViewListings = true,
}) => {
  const navigate = useNavigate();

  /** ----------------------------
   *  ID HANDLING (from version 1)
   *  ---------------------------- */
  const listingIdCandidate =
    vehicle?.listingId ??
    vehicle?.id ??
    vehicle?._id ??
    vehicle?.listing_id ??
    null;

  const vehicleIdCandidate =
    vehicle?.vehicleId ??
    vehicle?.vehicle_id ??
    null;

  /** ---------------------------------------
   *  NAVIGATION HANDLERS (merged versions)
   *  --------------------------------------- */
  const handleAction = () => {
    if (actionPath) {
      navigate(actionPath);
      return;
    }

    if (listingIdCandidate) {
      navigate(
        RoutePaths.LISTING_DETAIL.replace(":listingId", listingIdCandidate)
      );
      return;
    }

    if (vehicleIdCandidate) {
      navigate(
        RoutePaths.BROWSE_VEHICLE_LISTINGS.replace(
          ":vehicleId",
          vehicleIdCandidate
        )
      );
      return;
    }
  };

  /** ----------------------------
   *  IMAGE HANDLING (best merged)
   *  ---------------------------- */
  const rawBase64 = vehicle?.imageBase64 ?? vehicle?.base64image ?? null;

  let imageFromBase64 = null;
  if (typeof rawBase64 === "string" && rawBase64.trim()) {
    const s = rawBase64.trim();

    if (s.startsWith("data:")) {
      imageFromBase64 = s;
    } else {
      const cleaned = s.replace(/\s+/g, "");
      if (cleaned.length > 50) {
        imageFromBase64 = `data:image/jpeg;base64,${cleaned}`;
      }
    }
  }

  const imageValue =
    imageFromBase64 ??
    vehicle?.imageUrl ??
    vehicle?.image ??
    DEFAULT_PLACEHOLDER;

  const altText = vehicle?.value || "Listing image";

  /** ----------------------------
   *  BUTTON LABEL (from version 1)
   *  ---------------------------- */
  const defaultLabel = (() => {
    if (actionText) return actionText;
    if (listingIdCandidate) return "View Details";
    if (vehicleIdCandidate) return "View Listings";
    return "View";
  })();

  /** ============================================================
   *  LIST VARIANT
   *  ============================================================ */
  if (variant === "list") {
    return (
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex ${
          size === "large" ? "h-64" : "h-48"
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden bg-gray-200 ${
            size === "large" ? "w-80" : "w-56"
          }`}
        >
          <Base64Image
            value={imageValue}
            mime="image/jpeg"
            alt={altText}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3
              className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
                size === "large" ? "text-2xl" : "text-lg"
              }`}
            >
              {vehicle.value}
            </h3>

            {/* Details */}
            <div className="space-y-1 mb-3">
              {vehicle.year && (
                <p
                  className={`text-gray-600 font-medium ${
                    size === "large" ? "text-base" : "text-sm"
                  }`}
                >
                  {vehicle.year.value}
                </p>
              )}
              {vehicle.make && (
                <p
                  className={`text-gray-600 font-medium ${
                    size === "large" ? "text-base" : "text-sm"
                  }`}
                >
                  {vehicle.make.value}
                </p>
              )}
            </div>

            {vehicle.description && (
              <p
                className={`text-gray-500 ${
                  size === "large"
                    ? "line-clamp-3 text-base"
                    : "line-clamp-2 text-sm"
                } mb-4`}
              >
                {vehicle.description}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAction}
              className={`bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                size === "large"
                  ? "py-3 px-6 text-base"
                  : "py-2 px-4 text-sm"
              }`}
            >
              {defaultLabel}
            </button>

            {onSelect && (
              <button
                type="button"
                onClick={() => onSelect(vehicle)}
                className={`bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors ${
                  size === "large"
                    ? "py-3 px-6 text-base"
                    : "py-2 px-4 text-sm"
                }`}
              >
                Select
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /** ============================================================
   *  GRID VARIANT
   *  ============================================================ */
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col ${
        size === "large" ? "h-[32rem]" : "h-full"
      }`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-gray-200 ${
          size === "large" ? "h-72" : "h-48 sm:h-56"
        }`}
      >
        <Base64Image
          value={imageValue}
          mime="image/jpeg"
          alt={altText}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Content */}
      <div
        className={`p-4 sm:p-5 flex-1 flex flex-col ${
          size === "large" ? "p-6" : ""
        }`}
      >
        <h3
          className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
            size === "large" ? "text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {vehicle.value}
        </h3>

        <div className="space-y-1 mb-3 flex-1">
          {vehicle.year && (
            <p
              className={`text-gray-600 font-medium ${
                size === "large" ? "text-base" : "text-sm"
              }`}
            >
              {vehicle.year.value}
            </p>
          )}
          {vehicle.make && (
            <p
              className={`text-gray-600 font-medium ${
                size === "large" ? "text-base" : "text-sm"
              }`}
            >
              {vehicle.make.value}
            </p>
          )}
        </div>

        {vehicle.description && (
          <p
            className={`text-gray-500 mb-4 ${
              size === "large"
                ? "text-base line-clamp-4"
                : "text-xs sm:text-sm line-clamp-2"
            }`}
          >
            {vehicle.description}
          </p>
        )}
        {showViewListings && (
          <button
            onClick={handleAction}
            className={`w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
              size === "large" ? "py-3 text-base" : "py-2 sm:py-2.5 text-sm"
            }`}
          >
            {defaultLabel}
          </button>
        )}


        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(vehicle)}
            className="mt-3 w-full bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors py-2 text-sm"
          >
            Select Vehicle
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleResultCard;
