import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons not showing (common Leaflet + Webpack/Vite issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/**
 * DealerMap Component
 * Displays an interactive OpenStreetMap with a marker for the dealer/business location.
 * 
 * Props:
 * - address: string - The address to geocode and display on the map
 * - location: string - Alternative location string (used if address not provided)
 * - coordinates: { lat: number, lng: number } - Pre-defined coordinates (skips geocoding)
 * - businessName: string - Name to display in the marker popup
 * - height: string - CSS height for the map container (default: "300px")
 * - className: string - Additional CSS classes for the container
 */
const DealerMap = ({
  address,
  location,
  coordinates,
  businessName = "Business Location",
  height = "300px",
  className = "",
}) => {
  const [position, setPosition] = useState(coordinates || null);
  const [loading, setLoading] = useState(!coordinates);
  const [error, setError] = useState(null);

  // Geocode the address using Nominatim (OpenStreetMap's free geocoding API)
  useEffect(() => {
    // If coordinates are already provided, use them
    if (coordinates?.lat && coordinates?.lng) {
      setPosition(coordinates);
      setLoading(false);
      return;
    }

    const addressToGeocode = address || location;
    if (!addressToGeocode) {
      setError("No address provided");
      setLoading(false);
      return;
    }

    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Nominatim API - free geocoding service from OpenStreetMap
        // Note: Please respect their usage policy (max 1 request/second, include User-Agent)
        const encodedAddress = encodeURIComponent(addressToGeocode);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`,
          {
            headers: {
              // Nominatim requires a User-Agent header
              "User-Agent": "VehicleListingApp/1.0",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Geocoding failed: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setPosition({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          });
        } else {
          setError("Location not found");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Could not find location on map");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to respect Nominatim's rate limiting
    const timeoutId = setTimeout(geocodeAddress, 300);
    return () => clearTimeout(timeoutId);
  }, [address, location, coordinates]);

  // Loading state
  if (loading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !position) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}
        style={{ height }}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">{error || "Map unavailable"}</p>
          {(address || location) && (
            <p className="text-xs mt-1 text-gray-400">{address || location}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            <div className="text-center">
              <strong className="text-gray-900">{businessName}</strong>
              {(address || location) && (
                <p className="text-sm text-gray-600 mt-1">{address || location}</p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline mt-2 block"
              >
                Get Directions →
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DealerMap;
