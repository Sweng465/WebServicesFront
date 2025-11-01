import { useEffect, useState } from "react";

const PartSearch = ({ filters, setFilters }) => {
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
    fetch(`http://localhost:3000/api/partmodels?makeId=${filters.makeId}`)
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <select
        className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base"
        value={filters.yearId}
        onChange={(e) => handleChange("yearId", e.target.value)}
        style={{
          maxHeight: "200px",
          overflowY: "auto"
        }}
      >
        <option value="">📅 All Years</option>
        {years.map((y) => (
          <option key={y.yearId} value={y.yearId}>
            {y.value}
          </option>
        ))}
      </select>

      <select
        className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.makeId}
        onChange={(e) => handleChange("makeId", e.target.value)}
        disabled={!filters.yearId}
      >
        <option value="">🏭 All Makes</option>
        {makes.map((m) => (
          <option key={m.makeId} value={m.makeId}>
            {m.value}
          </option>
        ))}
      </select>

      <select
        className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.modelId}
        onChange={(e) => handleChange("modelId", e.target.value)}
        disabled={!filters.makeId}
      >
        <option value="">🚗 All Models</option>
        {models.map((model) => (
          <option key={model.modelId} value={model.modelId}>
            {model.value}
          </option>
        ))}
      </select>

      {/* Submodel if needed */}
      <select
        className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.submodelId}
        onChange={(e) => setFilters({ ...filters, submodelId: e.target.value })}
        disabled={!filters.modelId}
      >
        <option value="">⚙️ All Submodels</option>
      </select>

      <button
        onClick={() => setFilters({ ...filters })}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-md text-sm sm:text-base"
      >
        🔍 Search
      </button>
    </div>
  );
};

export default PartSearch;
