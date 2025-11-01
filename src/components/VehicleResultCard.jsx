const VehicleResultCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 h-48 sm:h-56">
        <img
          src={vehicle.imageUrl || "../assets/hot-listing-frame-1.png"}
          alt={vehicle.value}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {vehicle.price && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white font-bold px-3 py-1 rounded-lg text-sm sm:text-base">
            ${vehicle.price}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {vehicle.value}
        </h3>

        {/* Details */}
        <div className="space-y-1 mb-3 flex-1">
          {vehicle.year && (
            <p className="text-sm text-gray-600 font-medium">
              📅 {vehicle.year.value}
            </p>
          )}
          {vehicle.make && (
            <p className="text-sm text-gray-600 font-medium">
              🏭 {vehicle.make.value}
            </p>
          )}
        </div>

        {/* Description */}
        {vehicle.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-4">
            {vehicle.description}
          </p>
        )}

        {/* View Details Button */}
        <button className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
          View Details
        </button>
      </div>
    </div>
  );
};

export default VehicleResultCard;
