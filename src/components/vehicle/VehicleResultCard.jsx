import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../general/RoutePaths.jsx";

const VehicleResultCard = ({ vehicle, variant = 'grid', size = 'small' }) => {
  const navigate = useNavigate();

  const handleViewListings = () => {
    navigate(RoutePaths.BROWSE_VEHICLE_LISTINGS.replace(":vehicleId", vehicle.vehicleId));
  };

  if (variant === 'list') {
    return (
      <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex ${size === 'large' ? 'h-64' : 'h-48'}`}>
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-200 ${size === 'large' ? 'w-80' : 'w-56'}`}>
          <img
            src={vehicle.imageUrl || "../assets/hot-listing-frame-1.png"}
            alt={vehicle.value}
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
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col ${size === 'large' ? 'h-[32rem]' : 'h-full'}`}>
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gray-200 ${size === 'large' ? 'h-72' : 'h-48 sm:h-56'}`}>
        <img
          src={vehicle.imageUrl || "../assets/hot-listing-frame-1.png"}
          alt={vehicle.value}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
      </div>
    </div>
  );
};

export default VehicleResultCard;
