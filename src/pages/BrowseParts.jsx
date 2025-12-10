import { useEffect, useState } from "react";
import Header from "../components/Header";
import PartSearch from "../components/part/PartSearch";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import PartResultCard from "../components/part/PartResultCard";
import VehicleResultCard from "../components/vehicle/VehicleResultCard";
import Pagination from "../components/Pagination";
import API_ENDPOINTS from "../config/api.js";


const BrowseParts = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 });
    const [filters, setFilters] = useState({
        // vehicle filters
        yearId: "",
        makeId: "",
        modelId: "",
        submodelId: "",
        // part filters
        category1Id: "",
        category2Id: "",
        category3Id: "",
        brandId: "",
        vehicleId: "",
    });
    const [searchMode, setSearchMode] = useState('byVehicle'); // 'byVehicle' | 'generic'
    const [vehicles, setVehicles] = useState([]);
    const [vehicleLoading, setVehicleLoading] = useState(false);
    const PART_FILTERS_KEY = 'partFilters';
    const PART_SEARCH_MODE_KEY = 'partSearchMode';
    const [loadedPersisted, setLoadedPersisted] = useState(false);

    // Load persisted part filters & search mode
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const savedFilters = localStorage.getItem(PART_FILTERS_KEY);
                if (savedFilters) {
                    const parsed = JSON.parse(savedFilters);
                    if (parsed && typeof parsed === 'object') {
                        setFilters(prev => ({ ...prev, ...parsed }));
                    }
                }
                const savedMode = localStorage.getItem(PART_SEARCH_MODE_KEY);
                if (savedMode === 'byVehicle' || savedMode === 'generic') {
                    setSearchMode(savedMode);
                }
            }
        } catch (e) {
            console.warn('Failed to load persisted part filters:', e);
        } finally {
            setLoadedPersisted(true);
        }
    }, []);

    // Persist part-specific filters (exclude vehicle dropdown filters handled by VehicleSearch) + vehicleId
    useEffect(() => {
        if (!loadedPersisted) return; // avoid persisting initial empty defaults before load
        try {
            const toPersist = {
                category1Id: filters.category1Id || "",
                category2Id: filters.category2Id || "",
                category3Id: filters.category3Id || "",
                brandId: filters.brandId || "",
                vehicleId: filters.vehicleId || "",
            };
            localStorage.setItem(PART_FILTERS_KEY, JSON.stringify(toPersist));
        } catch (e) {
            console.warn('Failed to persist part filters:', e);
        }
    }, [filters.category1Id, filters.category2Id, filters.category3Id, filters.brandId, filters.vehicleId, loadedPersisted]);

    // Persist search mode
    useEffect(() => {
        if (!loadedPersisted) return;
        try { localStorage.setItem(PART_SEARCH_MODE_KEY, searchMode); } catch (e) {console.warn('Failed to persist part search mode:', e); }
    }, [searchMode, loadedPersisted]);

    const handleClearAllFilters = () => {
        setFilters({
            yearId: "",
            makeId: "",
            modelId: "",
            submodelId: "",
            category1Id: "",
            category2Id: "",
            category3Id: "",
            brandId: "",
            vehicleId: "",
        });
        setPage(1);
        try {
            localStorage.removeItem(PART_FILTERS_KEY);
            localStorage.removeItem('vehicleFilters'); // also clear vehicle dropdown persistence if desired
        } catch (e) {
            console.warn('Failed to clear persisted filters:', e);
        }
    };

    // Fetch vehicle results for selection when in 'byVehicle' mode and no vehicle selected
    useEffect(() => {
        if (searchMode !== 'byVehicle') {
            setVehicles([]);
            return;
        }
        if (filters.vehicleId) {
            // already selected, no need to fetch
            setVehicles([]);
            return;
        }

        let cancelled = false;
        const fetchVehicles = async () => {
            setVehicleLoading(true);
            try {
                const q = new URLSearchParams({
                    page: 1,
                    limit: 12,
                    yearId: filters.yearId || "",
                    makeId: filters.makeId || "",
                    modelId: filters.modelId || "",
                    submodelId: filters.submodelId || "",
                });
                const res = await fetch(`${API_ENDPOINTS.VEHICLES}?${q}`);
                const data = await res.json();
                if (!cancelled) {
                    const list = data.data || data.vehicles || [];
                    setVehicles(Array.isArray(list) ? list : []);
                }
            } catch (err) {
                console.error('Error fetching vehicles:', err);
            } finally {
                if (!cancelled) setVehicleLoading(false);
            }
        };

        fetchVehicles();
        return () => { cancelled = true; };
    }, [searchMode, filters.yearId, filters.makeId, filters.modelId, filters.submodelId, filters.vehicleId]);

    // Clear selected vehicleId if any of the vehicle selector fields change
    useEffect(() => {
        // Only run when a selector field changes — remove vehicleId so user can reselect
        setFilters((prev) => {
            if (!prev || !prev.vehicleId) return prev;
            const copy = { ...prev };
            delete copy.vehicleId;
            return copy;
        });
    }, [filters.yearId, filters.makeId, filters.modelId, filters.submodelId]);

    useEffect(() => {
        // If we're in vehicle mode and no vehicleId is selected, don't fetch parts
        if (searchMode === 'byVehicle' && !filters.vehicleId) {
            setParts([]);
            setPagination({ totalPages: 1 });
            return;
        }

        const fetchParts = async () => {
            setLoading(true);

            try {
                const query = new URLSearchParams({
                page,
                limit: 12,
                // vehicle filters
                yearId: filters.yearId || "",
                makeId: filters.makeId || "",
                modelId: filters.modelId || "",
                submodelId: filters.submodelId || "",
                vehicleId: filters.vehicleId || "",
                // part filters
                category1Id: filters.category1Id || "",
                category2Id: filters.category2Id || "",
                category3Id: filters.category3Id || "",
                brandId: filters.brandId || "",
                });
                const res = await fetch(`${API_ENDPOINTS.PARTS}?${query}`);
                const data = await res.json();

                // Support multiple response shapes: array, { data: [...] }, or { parts: [...] }
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : Array.isArray(data?.parts)
                            ? data.parts
                            : [];
                setParts(list);

                const raw = (Array.isArray(data) ? {} : (data.pagination || data.meta || {}));
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
                console.error("Error fetching parts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchParts();
    }, [filters, page, searchMode]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-600 to-blue-600">
            <Header />
            <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8 sm:mb-10">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                        Browse Parts
                        </h1>
                        <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                        Search for parts by year, make, model, and more.
                        </p>
                    </div>
                    {/* Search Section */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-10">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                                    Find parts
                                </h2>
                                <div className="inline-flex bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setSearchMode('byVehicle')}
                                        className={`px-4 py-2 text-sm font-medium ${searchMode === 'byVehicle' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        By vehicle
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchMode('generic')}
                                        className={`px-4 py-2 text-sm font-medium border-l border-gray-200 ${searchMode === 'generic' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        Generic
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleClearAllFilters}
                                    disabled={Object.values(filters).every(v => !v) && searchMode === 'byVehicle'}
                                    className="text-sm font-medium px-3 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Clear
                                </button>
                                {!loadedPersisted && (
                                    <span className="text-xs text-gray-500">Loading saved filters...</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {searchMode === 'byVehicle' ? (
                                <>
                                    <p className="text-sm text-gray-600 mb-2">Select a vehicle to narrow parts, then optionally refine by category or brand.</p>
                                    <VehicleSearch filters={filters} setFilters={setFilters} />

                                    {/* Vehicle results: show when in byVehicle mode and no vehicleId selected */}
                                    {!filters.vehicleId && (
                                        <div className="mt-4">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose a vehicle</h3>
                                                {vehicleLoading ? (
                                                    <div className="text-center text-gray-600">Loading vehicles...</div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {vehicles.map((v) => (
                                                            <VehicleResultCard
                                                                key={v.vehicleId || v.id}
                                                                vehicle={v}
                                                                variant="grid"
                                                                size="large"
                                                                onSelect={(veh) => {
                                                                    // When a vehicle is selected, fill any missing vehicle selector fields
                                                                    const yearId = veh?.year?.yearId || veh?.yearId || veh?.year?.id || null;
                                                                    const makeId = veh?.make?.makeId || veh?.makeId || veh?.make?.id || null;
                                                                    const modelId = veh?.model?.modelId || veh?.modelId || veh?.model?.id || null;
                                                                    const submodelId = veh?.submodel?.submodelId || veh?.submodelId || veh?.submodel?.id || null;
                                                                    setFilters(prev => ({
                                                                        ...prev,
                                                                        vehicleId: veh.vehicleId || veh.id,
                                                                        ...(yearId ? { yearId } : {}),
                                                                        ...(makeId ? { makeId } : {}),
                                                                        ...(modelId ? { modelId } : {}),
                                                                        ...(submodelId ? { submodelId } : {}),
                                                                    }));
                                                                }}
                                                                showViewListings={false}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    {/* Part filters only visible/enabled after vehicle selected */}
                                    {filters.vehicleId && (
                                        <div className="mt-4">
                                            <PartSearch filters={filters} setFilters={setFilters} vehicleId={filters.vehicleId} requireVehicle={true} />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-600 mb-2">Search parts without selecting a vehicle — filter by category or brand.</p>
                                    <PartSearch filters={filters} setFilters={setFilters} vehicleId={filters.vehicleId} requireVehicle={false} />
                                </>
                            )}
                        </div>
                    </div>
                    {/* Results Section */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 sm:p-6 lg:p-8">
                                        {searchMode === 'byVehicle' && !filters.vehicleId ? (
                                                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                                                    <p className="text-center text-lg text-gray-600">
                                                        Please select a vehicle to see compatible parts.
                                                    </p>
                                                </div>
                                        ) : loading ? (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-orange-600 mb-4"></div>
                            <p className="text-center text-lg text-gray-600">
                                Loading parts...
                            </p>
                            </div>
                        ) : parts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                            <p className="text-center text-lg text-gray-600">
                                No parts found. Try adjusting your filters.
                            </p>
                            </div>
                        ) : (
                            <>
                            <div className="mb-6">
                                <p className="text-gray-700 font-medium">
                                Found <span className="text-blue-600 font-bold">{parts.length}</span> part{parts.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                                {parts.map((v) => (
                                <PartResultCard key={v.partId} part={v} />
                                ))}
                            </div>
                            </>
                        )}
                        </div>
                        {/* Pagination Section */}
                        {parts.length > 0 && (
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
export default BrowseParts;