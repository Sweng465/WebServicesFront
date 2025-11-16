import { useEffect, useState } from "react";
import Header from "../components/Header";
import API_ENDPOINTS from "../config/api.js";
import BusinessCard from "../components/BusinessCard.jsx";
import Pagination from "../components/Pagination";

// Helper moved to top-level so effects don't need it in their dependency arrays
const findArrayInObject = (obj, depth = 3) => {
  if (!obj || typeof obj !== "object" || depth <= 0) return null;
  const keysToCheck = ["data", "business", "businesses", "results", "items"];
  for (const key of keysToCheck) {
    if (Array.isArray(obj[key])) return obj[key];
  }
  for (const key of Object.keys(obj)) {
    try {
      const val = obj[key];
      if (Array.isArray(val)) return val;
      if (val && typeof val === "object") {
        const found = findArrayInObject(val, depth - 1);
        if (Array.isArray(found)) return found;
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const Businesses = () => {
 
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit: 12,
        });

        const res = await fetch(`${API_ENDPOINTS.BUSINESSES}?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch businesses: HTTP ${res.status}`);
        }
        const data = await res.json();

        console.debug("GET /api/businesses raw response:", data);

        // Try to find the array of businesses (handles nested shapes like data.data.data)
        let parsedBusinesses = [];
        if (Array.isArray(data)) parsedBusinesses = data;
        else if (Array.isArray(data.data)) parsedBusinesses = data.data;
        else {
          const found = findArrayInObject(data, 4);
          parsedBusinesses = Array.isArray(found) ? found : [];
        }

        // Pagination - common shapes: data.pagination, data.meta, data.paging
        const rawPagination = data.pagination || data.meta || data.paging || {};
        const paginationData = {
          page: Number(rawPagination.page ?? rawPagination.currentPage ?? page),
          pages: Number(rawPagination.pages ?? rawPagination.totalPages ?? rawPagination.totalPages ?? 1),
          total: Number(rawPagination.total ?? rawPagination.count ?? 0),
          limit: Number(rawPagination.limit ?? rawPagination.pageSize ?? 12),
          hasNextPage: !!rawPagination.hasNextPage,
          hasPreviousPage: !!rawPagination.hasPreviousPage,
        };

        // If pagination info not present but backend supplies top-level counts, try those:
        if (!Object.keys(rawPagination).length) {
          // e.g. data.total or data.count
          paginationData.total = Number(data.total ?? data.count ?? paginationData.total);
          paginationData.limit = paginationData.limit || 12;
          paginationData.pages = paginationData.limit > 0 ? Math.max(1, Math.ceil(paginationData.total / paginationData.limit)) : 1;
        }

        setBusinesses(parsedBusinesses);
        setPagination(paginationData);

        // Debug helpful logs
        console.log("Parsed businesses:", parsedBusinesses);
        console.log("Pagination:", paginationData);
      } catch (error) {
        console.error("Error fetching businesses:", error);
        setBusinesses([]);
        setPagination({ page: 1, pages: 1, total: 0, limit: 12 });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page]);

  // Use pagination.total when it's a positive number; otherwise fall back to the actual array length
  const displayTotal = (typeof pagination.total === "number" && pagination.total > 0)
    ? pagination.total
    : businesses.length;

  const plural = displayTotal === 1 ? "business" : "businesses";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
      <Header />
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <h2 className="text-2xl font-bold text-white mb-6">Businesses</h2>
        </div>
      </div>

      {/* Businesses List Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading && <p className="text-white">Loading...</p>}

        {!loading && (!Array.isArray(businesses) || businesses.length === 0) && (
          <div className="text-white">
            <p>No businesses found.</p>

            {/* Temporary debug view to see what the component received */}
            <details className="mt-3 text-xs text-left bg-white bg-opacity-5 p-3 rounded max-h-64 overflow-auto">
              <summary className="cursor-pointer">Debug: businesses value (click to expand)</summary>
              <pre className="whitespace-pre-wrap mt-2 text-xs">{JSON.stringify(businesses, null, 2)}</pre>
            </details>
          </div>
        )}

        {/* White panel behind the cards */}
        {!loading && Array.isArray(businesses) && businesses.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-800 font-medium">
                Found <span className="text-blue-600 font-bold">{displayTotal}</span> {plural}
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <li key={business.id ?? business._id ?? business.name}>
                  <BusinessCard business={business} size="small" />
                </li>
              ))}
            </ul>

            {/* Pagination Section */}
            {businesses.length > 0 && (
              <div className="border-t border-gray-100 mt-6 pt-4">
                <Pagination
                  currentPage={page}
                  setPage={setPage}
                  totalPages={pagination.pages || 1}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  total={pagination.total}
                  limit={pagination.limit}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Businesses;
