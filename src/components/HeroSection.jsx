import { Link } from "react-router-dom";
import Magnet from "./Magnet";

const HeroSection = () => {
  return (
    <section className="text-center pt-12 pb-6 px-6">
      <h2 className="text-5xl font-bold mb-4">
        Find Quality Used Vehicles and Auto Parts
      </h2>
      <p className="text-xl max-w-2xl mx-auto mb-6">
        Connect with verified sellers, discover great deals, and find exactly
        what you need for your automotive projects.
      </p>
      <Magnet padding={50} magnetStrength={3}>
        <Link to="/browse-vehicles">
          <button className="bg-blue-800 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-xl hover:bg-blue-700 transition-all duration-300">
            Start Searching
          </button>
        </Link>
      </Magnet>
    </section>
  );
};

export default HeroSection;
