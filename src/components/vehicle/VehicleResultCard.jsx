import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../general/RoutePaths.jsx";
import Base64Image from "../Base64Image";

const DEFAULT_PLACEHOLDER = "/assets/hot-listing-frame-1.png";

const VehicleResultCard = ({ vehicle = {}, variant = 'grid', size = 'small', onSelect = null, showViewListings = true }) => {
  const navigate = useNavigate();

  const handleViewListings = () => {
    if (vehicle?.vehicleId) {
      navigate(RoutePaths.BROWSE_VEHICLE_LISTINGS.replace(":vehicleId", vehicle.vehicleId));
    }
  };

  // Build a safe image value:
  // 1) If imageBase64 exists, normalize/remove whitespace and build a data URL.
  // 2) Else use imageUrl or image.
  // 3) Else fallback to placeholder.
  const rawBase64 = vehicle?.imageBase64 ?? vehicle?.base64image ?? null;

  let imageFromBase64 = null;
  if (typeof rawBase64 === "string" && rawBase64.trim()) {
    const s = rawBase64.trim();
    // If it already looks like a data URL, pass through
    if (s.startsWith("data:")) {
      imageFromBase64 = s;
    } else {
      // Remove any whitespace/newlines that could break atob
      const cleaned = s.replace(/\s+/g, "");
      // Only build data URL for reasonably long strings (basic safety)
      if (cleaned.length > 50) {
        imageFromBase64 = `data:image/jpeg;base64,${cleaned}`;
      }
    }
  }

  const imageValue = imageFromBase64 ?? vehicle?.imageUrl ?? vehicle?.image ?? DEFAULT_PLACEHOLDER;
  const altText = vehicle?.value || "Listing image";

  // Debug: show a slice so you can verify what's being passed (remove once verified)
  console.log("Vehicle imageValue (start):", typeof imageValue === "string" ? imageValue.slice(0, 60) : imageValue);

  if (variant === 'list') {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex ${size === 'large' ? 'h-64' : 'h-48'}`}>
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-200 ${size === 'large' ? 'w-80' : 'w-56'}`}>
          <Base64Image
            value={imageValue}
            // For a data URL we don't need mime; if you pass raw base64 you'd set mime="image/jpeg"
            mime="image/jpeg"
            alt={altText}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            {/* Title */}
            <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${size === 'large' ? 'text-2xl' : 'text-lg'}`}>
              {vehicle.value}
            </h3>

            {/* Details */}
            <div className="space-y-1 mb-3">
              {vehicle.year && (
                <p className={`text-gray-600 font-medium ${size === 'large' ? 'text-base' : 'text-sm'}`}>
                  {vehicle.year.value}
                </p>
              )}
              {vehicle.make && (
                <p className={`text-gray-600 font-medium ${size === 'large' ? 'text-base' : 'text-sm'}`}>
                  {vehicle.make.value}
                </p>
              )}
            </div>

            {/* Description */}
            {vehicle.description && (
              <p className={`text-gray-500 ${size === 'large' ? 'line-clamp-3 text-base' : 'line-clamp-2 text-sm'} mb-4`}>
                {vehicle.description}
              </p>
            )}
          </div>

          {/* View Listings Button */}
          {showViewListings && (
            <button 
              onClick={handleViewListings}
              className={`bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                size === 'large' 
                  ? 'py-3 px-6 text-base w-auto self-start' 
                  : 'py-2 px-4 text-sm w-auto self-start'
              }`}
            >
              View Listings
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(vehicle)}
              className={`ml-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors ${
                size === 'large' ? 'py-3 px-6 text-base' : 'py-2 px-4 text-sm'
              }`}
            >
              Select Vehicle
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col ${size === 'large' ? 'h-[32rem]' : 'h-full'}`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-200 ${size === 'large' ? 'h-72' : 'h-48 sm:h-56'}`}>
        <Base64Image
          value={imageValue}
          mime="image/jpeg"
          alt={altText}
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Content Container */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col ${size === 'large' ? 'p-6' : ''}`}>
        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${size === 'large' ? 'text-2xl' : 'text-lg sm:text-xl'}`}>
          {vehicle.value}
        </h3>

        {/* Details */}
        <div className="space-y-1 mb-3 flex-1">
          {vehicle.year && (
            <p className={`text-gray-600 font-medium ${size === 'large' ? 'text-base' : 'text-sm'}`}>
              {vehicle.year.value}
            </p>
          )}
          {vehicle.make && (
            <p className={`text-gray-600 font-medium ${size === 'large' ? 'text-base' : 'text-sm'}`}>
              {vehicle.make.value}
            </p>
          )}
        </div>

        {/* Description */}
        {vehicle.description && (
          <p className={`text-gray-500 mb-4 ${size === 'large' ? 'text-base line-clamp-4' : 'text-xs sm:text-sm line-clamp-2'}`}>
            {vehicle.description}
          </p>
        )}

        {/* View Listings Button */}
        {showViewListings && (
          <button 
            onClick={handleViewListings}
            className={`w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
              size === 'large' 
                ? 'py-3 text-base' 
                : 'py-2 sm:py-2.5 text-sm sm:text-base'
            }`}
          >
            View Listings
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
