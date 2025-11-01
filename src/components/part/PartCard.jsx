
const PartCard = ({ part }) => {
  return (
    <div className="min-w-[300px] max-w-sm bg-white text-black rounded-lg overflow-hidden shadow-lg">
      <img
        src={part.image}
        alt={part.title}
        className="w-full h-[250px] object-cover"
      />
      <div className="p-4 text-center">
        <h3 className="text-xl font-semibold">{part.title}</h3>
      </div>
    </div>
  );
};

export default PartCard;
