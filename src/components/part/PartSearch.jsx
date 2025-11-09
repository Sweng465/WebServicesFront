import { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/api.js";

const PartSearch = ({ filters, setFilters }) => {
  const [brands, setBrands] = useState([]);
  const [category1, setCategory1] = useState([]);
  const [category2, setCategory2] = useState([]);
  const [category3, setCategory3] = useState([]);

  // Helper to extract id and label from items with differing shapes
  const getId = (item) => item.brandId ?? item.category1Id ?? item.category2Id ?? item.category3Id ?? item.id ?? item.valueId ?? item.key ?? item.name ?? item.value;
  const getLabel = (item) => item.value ?? item.name ?? item.label ?? String(getId(item));

  // Load all brands
  useEffect(() => {
    fetch(API_ENDPOINTS.BRANDS)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data || []);
        setBrands(arr);
      })
      .catch((err) => console.error("Error loading brands:", err));
  }, []);

  // Load category1 on mount
  useEffect(() => {
    fetch(API_ENDPOINTS.CATEGORY1)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data || data.category1 || []);
        setCategory1(arr);
      })
      .catch((err) => console.error("Error loading category1:", err));
  }, []);

  // Load category2 when category1 changes
  useEffect(() => {
    if (!filters.category1Id) {
      setCategory2([]);
      return;
    }
    fetch(`${API_ENDPOINTS.CATEGORY2}?category1Id=${filters.category1Id}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data || data.category2 || []);
        setCategory2(arr);
      })
      .catch((err) => console.error("Error loading category2:", err));
  }, [filters.category1Id]);

  // Load category3 when category2 changes
  useEffect(() => {
    if (!filters.category2Id) {
      setCategory3([]);
      return;
    }
    fetch(`${API_ENDPOINTS.CATEGORY3}?category2Id=${filters.category2Id}`)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data.data || data.category3 || []);
        setCategory3(arr);
      })
      .catch((err) => console.error("Error loading category3:", err));
  }, [filters.category2Id]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "category1Id" ? { category2Id: "", category3Id: "" } : {}),
      ...(key === "category2Id" ? { category3Id: "" } : {}),
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">

      {/* Category 1 */}
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.category1Id}
        onChange={(e) => handleChange("category1Id", e.target.value)}
      >
        <option value="">All Categories</option>
        {category1.map((c, idx) => (
          <option key={getId(c) ?? idx} value={getId(c)}>
            {getLabel(c)}
          </option>
        ))}
      </select>

      {/* Category 2 */}
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.category2Id}
        onChange={(e) => handleChange("category2Id", e.target.value)}
        disabled={!filters.category1Id}
      >
        <option value="">All Subcategories</option>
        {category2.map((c, idx) => (
          <option key={getId(c) ?? idx} value={getId(c)}>
            {getLabel(c)}
          </option>
        ))}
      </select>

      {/* Category 3 */}
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        value={filters.category3Id}
        onChange={(e) => handleChange("category3Id", e.target.value)}
        disabled={!filters.category2Id}
      >
        <option value="">All Sub-Subcategories</option>
        {category3.map((c, idx) => (
          <option key={getId(c) ?? idx} value={getId(c)}>
            {getLabel(c)}
          </option>
        ))}
      </select>

      {/* Brand */}
      <select
        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-700 font-medium text-sm sm:text-base"
        value={filters.brandId}
        onChange={(e) => handleChange("brandId", e.target.value)}
      >
        <option value="">All Brands</option>
        {brands.map((b, idx) => (
          <option key={getId(b) ?? idx} value={getId(b)}>
            {getLabel(b)}
          </option>
        ))}
      </select>

    </div>
  );
};

export default PartSearch;