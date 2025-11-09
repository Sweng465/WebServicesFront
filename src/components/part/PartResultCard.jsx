import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../general/RoutePaths.jsx";

const PartResultCard = ({ part }) => {
  const navigate = useNavigate();

  const handleViewListings = () => {
    navigate(RoutePaths.BROWSE_PART_LISTINGS.replace(":partId", part.partId));
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 h-48 sm:h-56">
        <img
          alt={part.value}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {part.value}
        </h3>

        {/* Details */}
        <div className="space-y-1 mb-3 flex-1">
          {part.year && (
            <p className="text-sm text-gray-600 font-medium">
              {part.year.value}
            </p>
          )}
          {part.make && (
            <p className="text-sm text-gray-600 font-medium">
              {part.make.value}
            </p>
          )}
        </div>

        {/* Description */}
        {part.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-4">
            {part.description}
          </p>
        )}

        {/* View Listings Button */}
        <button 
          onClick={handleViewListings}
          className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          View Listings
        </button>
      </div>
    </div>
  );
};

export default PartResultCard;
