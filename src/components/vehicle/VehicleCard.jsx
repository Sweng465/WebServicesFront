
const VehicleCard = ({ vehicle }) => {
  return (
    <div className="min-w-[300px] max-w-sm bg-white text-black rounded-lg overflow-hidden shadow-lg">
      <img
        src={vehicle.image}
        alt={vehicle.title}
        className="w-full h-[250px] object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold">{vehicle.title}</h3>
      </div>
    </div>
  );
};

export default VehicleCard;
