import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import API_ENDPOINTS from "../config/api.js";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { useNavigate } from "react-router-dom";
import Collapsible from "../components/forms/Collapsible";

const SellItems = () => {
  const { user, loading, authFetch, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const borderStyle = `border border-gray-300 rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`

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

  const requiredFields = [
    "description",
    "conditionId",
    "price",
  ];
  const requiredFilters = [
    "yearId",
    "makeId",
    "modelId",
    "submodelId",
  ];

  const isFormValid = () => { // check if all required fields are filled
    return requiredFields.every((field) => {
      const value = form[field];
      return value !== "" && value !== null && value !== undefined;
    });
  };
  const isFiltersValid = () => { // check if all required filters are selected
    return requiredFilters.every((filter) => {
      const value = filters[filter];
      return value !== "" && value !== null && value !== undefined;
    });
  };

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserProfile = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        const userProfile = data.data;

        setProfile(userProfile);

        if (Number(userProfile.roleId) !== 2) {
          navigate(RoutePaths.SELLERREGISTRATION);
        }
      } catch (err) {
        console.error(err);
        // Optionally redirect or show an error
      }
    };

    fetchUserProfile();
  }, [accessToken, navigate]);


  /*
  useEffect(() => {
    if (!user || !accessToken) return; // wait until user & token are loaded
    else {
      if (Number(user.roleId) !== 2) { // can only be accessed if user is seller
        navigate(RoutePaths.SELLERREGISTRATION);
        return;
      }
    }
    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user, authFetch, accessToken, navigate]);


  if (!profile) return <p>Loading profile...</p>;
  else {
    if (Number(user.roleId) !== 2) { // can only be accessed if user is seller
      navigate(RoutePaths.SELLERREGISTRATION);
      return;
    }
  }     */


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

  if (!user || loading) return <p>Loading user...</p>; // wait for auth state
  //if (Number(user.roleId) !== 2) return <p>Redirecting...</p>;
  if (!profile) return <p>Loading profile...</p>; // wait for auth state

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

  const PRICE_LIMIT = 18; // maximum digits before decimal (optional)

  const handlePriceChange = (value) => {
    // Allow only digits and optional decimal point, max 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= PRICE_LIMIT + 3) {
      handleChange("price", value);
    }
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-center text-2xl font-bold mb-4">Create Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Select Vehicle */}
          <div className={`p-4 ${borderStyle}`}>
            <h3 className="text-lg font-semibold mb-2">Select Vehicle</h3>
            <VehicleSearch filters={filters} setFilters={setFilters} />
          </div>

          <Collapsible title="Listing Information">
            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  placeholder="Ex. '02 Ford Ranger, failed inspection x4 due to excessive rust."
                  maxLength="300"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className={`w-full p-2 ${borderStyle}`}
                  rows={4}
                />
              </div>

              {/* Condition */}
              <div>
                <label className="block mb-1 font-medium">Condition</label>
                <select
                  value={form.conditionId}
                  onChange={(e) => handleChange("conditionId", e.target.value)}
                  className={`w-full p-2 ${borderStyle}`}
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map(c => <option key={c.conditionId} value={c.conditionId}>{c.value}</option>)}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input
                  type="number"
                  placeholder="Ex. 89.99"

                  value={form.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className={`w-full p-2 ${borderStyle}`}
                  inputMode="decimal"
                  required
                />
              </div>


              {/* Placeholder for photo upload */}
              <button
                type="button"
                className="w-full p-2 bg-gray-300 text-gray-800 rounded"
              >
                Upload Photos
              </button>
            </div>
          </Collapsible>

          {/* Create Listing Button */}
          <div className="relative group w-full">
            <button
              type="submit"
              disabled={!(isFormValid() && isFiltersValid())}
              className={`w-full p-2 font-medium rounded-md transition
                ${isFormValid() && isFiltersValid()
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
              Create Listing
            </button>
            {!(isFormValid() && isFiltersValid()) && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100
                transition-opacity whitespace-nowrap pointer-events-none">
                All required fields and filters must be filled out.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItems;
