// Centralized API Configuration
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  // Authentication endpoints
  SIGN_UP: `${API_BASE_URL}/api/auth/signup`,
  SIGN_IN: `${API_BASE_URL}/api/auth/signin`,

  // Vehicle endpoints
  VEHICLES: `${API_BASE_URL}/api/vehicles`,
  YEARS: `${API_BASE_URL}/api/years`,
  MAKES: `${API_BASE_URL}/api/makes`,
  VEHICLE_MODELS: `${API_BASE_URL}/api/vehiclemodels`,
  SUBMODELS: `${API_BASE_URL}/api/submodels`,

  // Parts endpoints
  PARTS: `${API_BASE_URL}/api/parts`,
  CONDITIONS: `${API_BASE_URL}/api/conditions`,
  BRANDS: `${API_BASE_URL}/api/brands`,
  CATEGORY1: `${API_BASE_URL}/api/category1`,
  CATEGORY2: `${API_BASE_URL}/api/category2`,
  CATEGORY3: `${API_BASE_URL}/api/category3`,

  // Listings endpoints
  LISTINGS: `${API_BASE_URL}/api/listings`,
  VEHICLE_LISTINGS: `${API_BASE_URL}/api/listings/vehicle`,
  PART_LISTINGS: `${API_BASE_URL}/api/listings/part`,
  // Listings by vehicle id
  LISTINGS_BY_VEHICLE: `${API_BASE_URL}/api/listings/vehicle`,
  CREATE_LISTING: `${API_BASE_URL}/api/listings`,
  LISTING_BY_BUSINESS: `${API_BASE_URL}/api/listings/business/:businessId`,

  // User endpoints
  USERS: `${API_BASE_URL}/api/users`,
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,

  // Seller endpoints
  SELLERS: `${API_BASE_URL}/api/sellers`,
  BUSINESSES: `${API_BASE_URL}/api/businesses`,

  // Reviews endpoints
  REVIEWS: `${API_BASE_URL}/api/businesses/:id/reviews`,

  // Address endpoints
  ADDRESS: `${API_BASE_URL}/api/address`,
};

export const buildVehicleDetailUrl = (vehicleId) => `${API_BASE_URL}/api/vehicles/${vehicleId}`;
export const buildBusinessDetailUrl = (businessId) => `${API_BASE_URL}/api/businesses/${businessId}`;

export default API_ENDPOINTS;
