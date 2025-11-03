import { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/api.js";

const VehicleSearch = ({ filters, setFilters }) => {
  const [years, setYears] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);

  // Load all years
  useEffect(() => {
    fetch(API_ENDPOINTS.YEARS)
      .then((res) => res.json())
      .then((data) => {
        const yearsArray = Array.isArray(data) ? data : (data.data || []);
        setYears(yearsArray);
      })
      .catch((err) => console.error("Error loading years:", err));
  }, []);

  // Load makes when year changes
  useEffect(() => {
    if (!filters.yearId) return;
    fetch(`${API_ENDPOINTS.MAKES}?yearId=${filters.yearId}`)
      .then((res) => res.json())
      .then((data) => {
        const makesArray = Array.isArray(data) ? data : (data.data || data.makes || []);
        setMakes(makesArray);
      })
      .catch((err) => console.error("Error loading makes:", err));
  }, [filters.yearId]);

  // Load models when make changes
  useEffect(() => {
    if (!filters.makeId) return;
    fetch(`${API_ENDPOINTS.VEHICLE_MODELS}?makeId=${filters.makeId}`)
      .then((res) => res.json())
      .then((data) => {
        const modelsArray = Array.isArray(data) ? data : (data.data || data.models || []);
        setModels(modelsArray);
      })
      .catch((err) => console.error("Error loading models:", err));
  }, [filters.makeId]);

  // Load submodels when model changes
  useEffect(() => {
    if (!filters.modelId) return;
    fetch(`${API_ENDPOINTS.SUBMODELS}?modelId=${filters.modelId}`)
      .then((res) => res.json())
      .then((data) => {
        const submodelsArray = Array.isArray(data) ? data : (data.data || data.submodels || []);
        setSubmodels(submodelsArray);
      })
      .catch((err) => console.error("Error loading submodels:", err));
  }, [filters.modelId]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "yearId" ? { makeId: "", modelId: "", submodelId: "" } : {}),
      ...(key === "makeId" ? { modelId: "", submodelId: "" } : {}),
      ...(key === "modelId" ? { submodelId: "" } : {}),
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base"
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
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
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

      {/* Always show submodel select; enable only when a model is selected and there are submodels */}
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.submodelId}
        onChange={(e) => handleChange("submodelId", e.target.value)}
        disabled={!filters.modelId || submodels.length === 0}
      >
        <option value="">All Submodels</option>
        {submodels.length === 0 ? (
          <option value="" disabled>
            No submodels available
          </option>
        ) : (
          submodels.map((submodel) => (
            <option key={submodel.submodelId} value={submodel.submodelId}>
              {submodel.value}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default VehicleSearch;
