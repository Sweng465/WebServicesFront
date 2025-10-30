import { useEffect, useState } from "react";
import Header from "../components/Header";
import VehicleSearch from "../components/VehicleSearch";
import VehicleResultCard from "../components/VehicleResultCard";
import Pagination from "../components/Pagination";

const BrowseCars = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const [filters, setFilters] = useState({
    yearId: "",
    makeId: "",
    modelId: "",
    submodelId: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page,
          limit: 12,
          yearId: filters.yearId || "",
          makeId: filters.makeId || "",
          modelId: filters.modelId || "",
          submodelId: filters.submodelId || "",
        });

        const res = await fetch(`http://localhost:3000/api/vehicles?${query}`);
        const data = await res.json();

        // The backend returns { data: [...], pagination: {...} }
        setVehicles(data.data || []);
        setPagination(data.pagination || { totalPages: 1 });
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <main className="px-8 py-10">
        <div className="max-w-7xl mx-auto bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-xl p-6">
          <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Browse Cars
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Search for vehicles by year, make and model.
          </p>

          <VehicleSearch filters={filters} setFilters={setFilters} />

          {loading ? (
            <p className="text-center mt-8 text-lg text-white">
              Loading vehicles...
            </p>
          ) : vehicles.length === 0 ? (
            <p className="text-center mt-8 text-lg text-white">
              No vehicles found. Try adjusting filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {vehicles.map((v) => (
                <VehicleResultCard key={v.vehicleId} car={v} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            setPage={setPage}
            totalPages={pagination.totalPages || 1}
          />
        </div>
      </main>
    </div>
  );
};

export default BrowseCars;
