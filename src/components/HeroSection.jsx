import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="text-center py-20 px-6">
      <h2 className="text-5xl font-bold mb-6">
        Find Quality Used Vehicles <br /> and Auto Parts
      </h2>
      <p className="text-xl max-w-2xl mx-auto mb-8">
        Connect with verified sellers, discover great deals, and find exactly
        what you need for your automotive projects.
      </p>
      <Link to="/browse-vehicles">
        <button className="bg-blue-800 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-xl transition">
          Start Searching
        </button>
      </Link>
    </section>
  );
};

export default HeroSection;
