import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";

const SellItems = () => {
  const { user, authFetch, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    yearId: "",
    makeId: "",
    modelId: "",
    description: "",
    conditionId: "",
    price: "",
    photos: [],
  });
  

  // Dropdown options
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [conditions, setConditions] = useState([]);

  

  useEffect(() => {
    if (!user?.id || !accessToken) return;

    const fetchProfile = async () => {
      try {
        const res = await authFetch("http://localhost:3000/api/users/profile");
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [user, authFetch, accessToken]);

  // Load years and conditions
  useEffect(() => {
    fetch("http://localhost:3000/api/years")
      .then(res => res.json())
      .then(data => setYears(data.data || []))
      .catch(err => console.error(err));
    /*
    fetch("http://localhost:3000/api/conditions")
      .then(res => res.json())
      .then(data => setConditions(data.data || []))
      .catch(err => console.error(err));
      */
    // Temporarily hardcode conditions if API isn't ready
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

  // Load makes when year changes
  useEffect(() => {
    if (!form.yearId) return;
    fetch(`http://localhost:3000/api/makes?yearId=${form.yearId}`)
      .then(res => res.json())
      .then(data => setMakes(data.data || []))
      .catch(err => console.error(err));
    setForm(prev => ({ ...prev, makeId: "", modelId: "" }));
  }, [form.yearId]);

  // Load models when make changes
  useEffect(() => {
    if (!form.makeId) return;
    fetch(`http://localhost:3000/api/vehiclemodels?makeId=${form.makeId}`)
      .then(res => res.json())
      .then(data => setModels(data.data || []))
      .catch(err => console.error(err));
    setForm(prev => ({ ...prev, modelId: "" }));
  }, [form.makeId]);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch("http://localhost:3000/api/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Listing created:", data);
      // maybe redirect or reset form
    } catch (err) {
      console.error("Failed to create listing", err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Create Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {/* Year/Make/Model */}
          <div className="flex gap-2">
            <select
              value={form.yearId}
              onChange={(e) => handleChange("yearId", e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            >
              <option value="">Select Year</option>
              {years.map(y => <option key={y.yearId} value={y.yearId}>{y.value}</option>)}
            </select>

            <select
              value={form.makeId}
              onChange={(e) => handleChange("makeId", e.target.value)}
              className="flex-1 p-2 border rounded"
              disabled={!form.yearId}
              required
            >
              <option value="">Select Make</option>
              {makes.map(m => <option key={m.makeId} value={m.makeId}>{m.value}</option>)}
            </select>

            <select
              value={form.modelId}
              onChange={(e) => handleChange("modelId", e.target.value)}
              className="flex-1 p-2 border rounded"
              disabled={!form.makeId}
              required
            >
              <option value="">Select Model</option>
              {models.map(m => <option key={m.modelId} value={m.modelId}>{m.value}</option>)}
            </select>
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
