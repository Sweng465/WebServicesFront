import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import VehicleCard from "../components/VehicleCard";

import hotListingFrame1 from "../assets/hot-listing-frame-1.png";
import hotListingFrame2 from "../assets/hot-listing-frame-2.png";
import hotListingFrame3 from "../assets/hot-listing-frame-3.png";

const vehicleListings = [
  {
    id: 1,
    image: hotListingFrame1,
    title: "2002 Ford Ranger",
  },
  {
    id: 2,
    image: hotListingFrame2,
    title: "1999 Mazda Miata",
  },
  {
    id: 3,
    image: hotListingFrame3,
    title: "2003 Dodge SRT-4",
  },
];

export const Homepage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <HeroSection />

      <section className="px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Hot Listings</h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {vehicleListings.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Homepage;
