import { useEffect, useState } from "react";

const VehicleSearch = ({ filters, setFilters }) => {
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  // Load all years
  useEffect(() => {
    fetch("http://localhost:3000/api/years")
      .then((res) => res.json())
      .then((data) => setYears(data.data || []))
      .catch((err) => console.error("Error loading years:", err));
  }, []);

  // Load makes when year changes
  useEffect(() => {
    if (!filters.yearId) return;
    fetch(`http://localhost:3000/api/makes?yearId=${filters.yearId}`)
      .then((res) => res.json())
      .then((data) => setMakes(data.data || []))
      .catch((err) => console.error("Error loading makes:", err));
  }, [filters.yearId]);

  // Load models when make changes
  useEffect(() => {
    if (!filters.makeId) return;
    fetch(`http://localhost:3000/api/vehiclemodels?makeId=${filters.makeId}`)
      .then((res) => res.json())
      .then((data) => setModels(data.data || []))
      .catch((err) => console.error("Error loading models:", err));
  }, [filters.makeId]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "yearId" ? { makeId: "", modelId: "" } : {}),
      ...(key === "makeId" ? { modelId: "" } : {}),
    }));
  };

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-4 flex flex-wrap gap-4 justify-center text-gray-800">
      <select
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={filters.yearId}
        onChange={(e) => handleChange("yearId", e.target.value)}
        style={{
          maxHeight: "200px",
          overflowY: "auto"
        }}
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y.yearId} value={y.yearId}>
            {y.value}
          </option>
        ))}
      </select>

      <select
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={filters.makeId}
        onChange={(e) => handleChange("makeId", e.target.value)}
        disabled={!filters.yearId}
      >
        <option value="">All Makes</option>
        {makes.map((m) => (
          <option key={m.makeId} value={m.makeId}>
            {m.value}
          </option>
        ))}
      </select>

      <select
        className="px-3 py-2 border border-gray-300 rounded-md"
        value={filters.modelId}
        onChange={(e) => handleChange("modelId", e.target.value)}
        disabled={!filters.makeId}
      >
        <option value="">All Models</option>
        {models.map((model) => (
          <option key={model.modelId} value={model.modelId}>
            {model.value}
          </option>
        ))}
      </select>

      <button
        onClick={() => setFilters({ ...filters })}
        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
      >
        Search
      </button>
    </div>
  );
};

export default VehicleSearch;
