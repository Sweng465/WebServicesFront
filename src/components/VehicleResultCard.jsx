const VehicleResultCard = ({ car }) => {
  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={car.imageUrl || "../assets/hot-listing-frame-1.png"}
        alt={car.value}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{car.value}</h3>
        {car.make && <p className="text-gray-600">{car.make.value}</p>}
        {car.year && <p className="text-gray-600">{car.year.value}</p>}
        {car.price && <p className="text-gray-800 font-bold mt-1">${car.price}</p>}
        {car.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{car.description}</p>
        )}
      </div>
    </div>
  );
};

export default VehicleResultCard;
