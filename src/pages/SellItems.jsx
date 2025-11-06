import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import API_ENDPOINTS from "../config/api.js";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { useNavigate } from "react-router-dom";

const SellItems = () => {
  const { user, authFetch, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    description: "",
    conditionId: "",
    price: "",
  });

  const [filters, setFilters] = useState({
    yearId: "",
    makeId: "",
    modelId: "",
    submodelId: "",
  });

  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    if (!user?.id || !accessToken) return;
    if (user.roleId != 2) navigate(RoutePaths.SELLERREGISTRATION);

    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [user, authFetch, accessToken, navigate]);

  // Load conditions
  useEffect(() => {
    /*
    fetch(API_ENDPOINTS.CONDITIONS)
      .then(res => res.json())
      .then(data => setConditions(data.data || []))
      .catch(err => console.error(err));
      */
    // Temporarily hardcode conditions since no conditions API
    const fallbackConditions = [
        { conditionId: 6, value: "Burnt" },
        { conditionId: 7, value: "Bent Frame" },
        { conditionId: 8, value: "Dent" },
        { conditionId: 9, value: "Scratched" },
        { conditionId: 10, value: "Flood Damage" },
        { conditionId: 11, value: "Hail Damage" },
        { conditionId: 12, value: "Rust" },
        { conditionId: 13, value: "Engine Damage" },
        { conditionId: 14, value: "Transmission Damage" },
        { conditionId: 15, value: "Electrical Damage" },
        { conditionId: 16, value: "Interior Damage" },
        { conditionId: 17, value: "Broken Glass" },
        { conditionId: 18, value: "Missing Parts" },
        { conditionId: 19, value: "Suspension Damage" },
        { conditionId: 20, value: "Totaled" },
    ];

    setConditions(fallbackConditions);
  }, []);

  const fetchVehicleId = async (filters) => {
    console.log("fetchVehicleId filters:", filters);
    const query = new URLSearchParams({
      yearId: filters.yearId,
      makeId: filters.makeId,
      modelId: filters.modelId,
      submodelId: filters.submodelId,
    });

    const res = await fetch(`${API_ENDPOINTS.VEHICLES}?${query}`);
    const data = await res.json();
    console.log("Vehicle response:", data);

    const vehicles = data.data || data.vehicles || data || [];
    if (!Array.isArray(vehicles) || vehicles.length === 0)
      throw new Error("No vehicle found for selected combination.");

    return vehicles[0].vehicleId;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the vehicleId based on selected filters
      const vehicleId = await fetchVehicleId(filters);

      const payload = {
        businessId: 1, // 1 for now until we have ability to create businesses
        date: new Date().toISOString(),
        price: parseFloat(form.price),
        description: form.description,
        isAvailable: 1,
        conditionId: parseInt(form.conditionId),
        disabled: 0,
        listingTypeId: 1, // 1 for now until we implement part listings
        itemId: vehicleId,
      };

      const res = await authFetch(API_ENDPOINTS.CREATE_LISTING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Listing created:", data);
    } catch (err) {
      console.error("Failed to create listing:", err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Create Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Vehicle</h3>
            <VehicleSearch filters={filters} setFilters={setFilters} />
          </div>
          
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />

          <select
            value={form.conditionId}
            onChange={(e) => handleChange("conditionId", e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Condition</option>
            {conditions.map(c => <option key={c.conditionId} value={c.conditionId}>{c.value}</option>)}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Placeholder for photo upload */}
          <button
            type="button"
            className="w-full p-2 bg-gray-300 text-gray-800 rounded"
          >
            Upload Photos
          </button>

          <button
            type="submit"
            className="w-full p-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          >
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellItems;
