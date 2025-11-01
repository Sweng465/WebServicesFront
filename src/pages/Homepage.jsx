import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import HotListings from "../components/HotListings";

export const Homepage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <HeroSection />
      <HotListings />
    </div>
  );
};

export default Homepage;
