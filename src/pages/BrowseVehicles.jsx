import { useEffect, useState } from "react";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import VehicleResultCard from "../components/vehicle/VehicleResultCard";
import Pagination from "../components/Pagination";
import API_ENDPOINTS from "../config/api.js";
import { LayoutGrid, List, AArrowUp, AArrowDown  } from 'lucide-react';
import { RoutePaths } from "../general/RoutePaths.jsx";

const BrowseVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [size, setSize] = useState("small"); // 'small' | 'large'
  const VIEW_MODE_KEY = 'vehicleViewMode';
  const CARD_SIZE_KEY = 'vehicleCardSize';
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  // Load persisted view layout & size before user interaction
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedView = localStorage.getItem(VIEW_MODE_KEY);
        if (savedView === 'grid' || savedView === 'list') {
          setViewMode(savedView);
        }
        const savedSize = localStorage.getItem(CARD_SIZE_KEY);
        if (savedSize === 'small' || savedSize === 'large') {
          setSize(savedSize);
        }
      }
    } catch (e) {
      console.warn('Failed loading persisted layout settings:', e);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  // Persist view mode changes (skip initial default write until loaded)
  useEffect(() => {
    if (!settingsLoaded) return;
    try { localStorage.setItem(VIEW_MODE_KEY, viewMode); } catch (e) {console.warn('Failed to persist view mode:', e); }
  }, [viewMode, settingsLoaded]);

  // Persist card size changes (skip initial default write until loaded)
  useEffect(() => {
    if (!settingsLoaded) return;
    try { localStorage.setItem(CARD_SIZE_KEY, size); } catch (e) {console.warn('Failed to persist card size:', e); }
  }, [size, settingsLoaded]);
  const [filters, setFilters] = useState({
    yearId: "",
    makeId: "",
    modelId: "",
    submodelId: "",
  });
  // Track when persisted filters have been loaded to avoid double-fetch on mount
  // Persistence handled by VehicleSearch component now
  const [filtersInitialized, setFiltersInitialized] = useState(false);

  // Load persisted filters BEFORE first fetch so results match visible dropdown state on initial render
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('vehicleFilters');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setFilters(prev => ({ ...prev, ...parsed }));
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read persisted vehicle filters:', e);
    } finally {
      setFiltersInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!filtersInitialized) return; // wait until we know persisted filters are applied
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
        const res = await fetch(`${API_ENDPOINTS.VEHICLES}?${query}`);
        const data = await res.json();
        const vehiclesData = data.data || data.vehicles || data || [];
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        const raw = data.pagination || {};
        const paginationData = {
          page: Number(raw.page || 1),
          pages: Number(raw.pages ?? raw.totalPages ?? 1),
          total: Number(raw.total ?? 0),
          limit: Number(raw.limit ?? 12),
          hasNextPage: !!raw.hasNextPage,
          hasPreviousPage: !!raw.hasPreviousPage,
        };
        setPagination(paginationData);
        if (paginationData.page !== page) {
          setPage(paginationData.page);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [filters, page, filtersInitialized]);

  const handleClearFilters = () => {
    setFilters({ yearId: "", makeId: "", modelId: "", submodelId: "" });
    setPage(1);
    try { localStorage.removeItem('vehicleFilters'); } catch (e) {console.warn('Failed to clear persisted filters:', e);}
  };
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
        <Header />
        <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 sm:mb-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                Browse Vehicles
                </h1>
                <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                Search for vehicles by year, make, model, and more.
                </p>
            </div>
            {/* Search Section */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Filters</h2>
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-sm font-medium px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50"
            disabled={!filters.yearId && !filters.makeId && !filters.modelId && !filters.submodelId}
          >
            Clear
          </button>
        </div>
        <VehicleSearch filters={filters} setFilters={setFilters} />
      </div>
            {/* Results Section */}
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-4 sm:p-6 lg:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4"></div>
                    <p className="text-center text-lg text-gray-600">
                        Loading vehicles...
                    </p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <p className="text-center text-lg text-gray-600">
                        No vehicles found. Try adjusting your filters.
                    </p>
                    </div>
                ) : (
                    <>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <p className="text-gray-700 font-medium">
                        Found <span className="text-blue-600 font-bold">{pagination.total}</span> vehicle{pagination.total !== 1 ? 's' : ''}
                        </p>
                        <div className="flex gap-2 self-start">
                          {/* View mode toggle */}
                          <div className="inline-flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                              type="button"
                              onClick={() => setViewMode('grid')}
                              aria-pressed={viewMode === 'grid'}
                              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              {/* <span className="material-icons text-base hidden sm:inline">grid_view</span> */}
                              <LayoutGrid className="text-base hidden sm:inline" />
                              Grid
                            </button>
                            <button
                              type="button"
                              onClick={() => setViewMode('list')}
                              aria-pressed={viewMode === 'list'}
                              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-l border-gray-200 transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              <List className="text-base hidden sm:inline" />
                              List
                            </button>
                          </div>
                          {/* Size toggle */}
                          <div className="inline-flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                              type="button"
                              onClick={() => setSize('small')}
                              aria-pressed={size === 'small'}
                              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${size === 'small' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              <AArrowDown className="text-base hidden sm:inline" />
                              Small
                            </button>
                            <button
                              type="button"
                              onClick={() => setSize('large')}
                              aria-pressed={size === 'large'}
                              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-l border-gray-200 transition-colors ${size === 'large' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                              <AArrowUp className="text-base hidden sm:inline" />
                              Large
                            </button>
                          </div>
                        </div>
                    </div>
                    {viewMode === 'grid' ? (
                      <div className={`grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6 
                        ${size === 'small' 
                          ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6' 
                          : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        }`}
                      >
                        {vehicles.map((v) => (
                          <VehicleResultCard key={v.vehicleId} vehicle={v} variant="grid" size={size} actionPath={RoutePaths.BROWSE_VEHICLE_LISTINGS.replace(":vehicleId", v.vehicleId)} actionText={"View Listings"} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {vehicles.map((v) => (
                          <VehicleResultCard key={v.vehicleId} vehicle={v} variant="list" size={size} actionPath={RoutePaths.BROWSE_VEHICLE_LISTINGS.replace(":vehicleId", v.vehicleId)} actionText={"View Listings"} />
                        ))}
                      </div>
                    )}
                    </>
                )}
                </div>
                {/* Pagination Section */}
                {vehicles.length > 0 && (
                <div className="border-t border-gray-200 p-4 sm:p-6 lg:p-8 bg-gray-50">
                    <Pagination
                    currentPage={page}
                    setPage={setPage}
                    totalPages={pagination.pages || pagination.totalPages || 1}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                    total={pagination.total}
                    limit={pagination.limit}
                    />
                </div>
                )}
            </div>
            </div>
        </main>
        </div>
    );
};
export default BrowseVehicles;