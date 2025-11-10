import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import API_ENDPOINTS from "../config/api.js";
import Converter from "../imageConversion/ImageConverter.js";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";

const SellItems = () => {
  const { user, authFetch, accessToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    description: "",
    conditionId: "",
    price: "",
  });

  const [filters, setFilters] = useState({
    yearId: "",
    makeId: "",
    modelId: "",
    submodelId: "",
  });

  const [conditions, setConditions] = useState([]);

  // Image upload state
  const [images, setImages] = useState([]); // { name, dataUrl, file }
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.id || !accessToken) return;

    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [user, authFetch, accessToken]);

  // Load conditions
  useEffect(() => {
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

  const fetchVehicleId = async (filters) => {
    const query = new URLSearchParams({
      yearId: filters.yearId,
      makeId: filters.makeId,
      modelId: filters.modelId,
      submodelId: filters.submodelId,
    });

    const res = await fetch(`${API_ENDPOINTS.VEHICLES}?${query}`);
    const data = await res.json();

    const vehicles = data.data || data.vehicles || data || [];
    if (!Array.isArray(vehicles) || vehicles.length === 0)
      throw new Error("No vehicle found for selected combination.");

    return vehicles[0].vehicleId;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // File input change: convert files to data URLs for preview and for sending
  const handleFileChange = (e) => {
    const chosenFiles = Array.from(e.target.files || []);
    if (chosenFiles.length === 0) return;

    const readers = chosenFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            dataUrl: reader.result, // data:<mime>;base64,....
            file,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers)
      .then((results) => {
        setImages((prev) => [...prev, ...results]);
        // reset input so same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = "";
      })
      .catch((err) => {
        console.error("Error reading files:", err);
      });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /**
 * Resize a data URL (image) to fit within maxWidth/maxHeight preserving aspect ratio.
 * Returns a data URL with the requested mime and quality.
 */
async function resizeDataUrl(dataUrl, maxWidth = 1024, maxHeight = 1024, mime = "image/jpeg", quality = 0.8) {
  if (!dataUrl || typeof dataUrl !== "string") return dataUrl;

  // If already a data URL with small size, we could skip — but we'll still do the check by image dimensions
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    // Necessary for CORS images loaded from remote URLs — not needed for FileReader data URLs
    image.crossOrigin = "Anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image for resize"));
    image.src = dataUrl;
  });

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // If image is already small enough, return original
  if (width <= maxWidth && height <= maxHeight) {
    return dataUrl;
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  const targetWidth = Math.round(width * ratio);
  const targetHeight = Math.round(height * ratio);

  // Use OffscreenCanvas if available for better performance
  let canvas;
  if (typeof OffscreenCanvas !== "undefined") {
    canvas = new OffscreenCanvas(targetWidth, targetHeight);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    // OffscreenCanvas doesn't have toDataURL in some browsers — convert to Blob then read as dataURL
    if (typeof canvas.convertToBlob === "function") {
      const blob = await canvas.convertToBlob({ type: mime, quality });
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    // else fallthrough to using toDataURL if polyfilled
  } else {
    canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    // Optional: clear and draw
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL(mime, quality);
  }

  // Fallback — if we reach here, try toDataURL (some OffscreenCanvas impls support it)
  try {
    return canvas.toDataURL(mime, quality);
  } catch {
    return dataUrl; // give up gracefully
  }
}

/* --- Replace the imagesPayload creation in handleSubmit with the async resizing logic below --- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const vehicleId = await fetchVehicleId(filters);

      // RESIZE SETTINGS
      const MAX_DIMENSION = 1024; // max width or height in pixels
      const MIME = "image/jpeg";
      const QUALITY = 0.8; // 0..1 for JPEG compression

      // 1) Resize images (async). We use the preview dataUrls stored in `images[*].dataUrl`.
      const resizedDataUrls = await Promise.all(
        images.map(async (img) => {
          try {
            // img.dataUrl is "data:<mime>;base64,..." from FileReader
            // If it's already a data URL we pass it to the resizer; if not, pass as-is
            const original = img.dataUrl;
            const resized = await resizeDataUrl(original, MAX_DIMENSION, MAX_DIMENSION, MIME, QUALITY);
            return resized;
          } catch (err) {
            console.warn("Resize failed for image, using original preview:", err);
            return img.dataUrl;
          }
        })
      );

      // 2) Convert resizedDataUrls to raw base64 strings expected by your backend
      const imagesPayload = resizedDataUrls.map((d) => {
        try {
          return Converter.dataUrlToBase64(d); // strips data:<mime>;base64, prefix
        } catch {
          // If conversion fails, try to return the original string (or empty)
          return typeof d === "string" ? d.replace(/^data:[^;]+;base64,/, "") : "";
        }
      }).filter(Boolean);

      const payload = {
        businessId: 1,
        date: new Date().toISOString(),
        price: parseFloat(form.price),
        description: form.description,
        isAvailable: 1,
        conditionId: parseInt(form.conditionId),
        disabled: 0,
        listingTypeId: 1,
        itemId: vehicleId,
        images: imagesPayload,
      };

      const res = await authFetch(API_ENDPOINTS.CREATE_LISTING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Listing created:", data);
      navigate(RoutePaths.LISTING_DETAIL.replace(":listingId", data.listingInfoId));
    } catch (err) {
      console.error("Failed to create listing:", err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-2xl font-bold mb-4">Create Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Vehicle</h3>
            <VehicleSearch filters={filters} setFilters={setFilters} />
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

          {/* Hidden file input + styled button with preview */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2 bg-gray-300 text-gray-800 rounded flex items-center gap-3"
            >
              {images.length > 0 ? (
                <>
                  <img src={images[0].dataUrl} alt="preview" className="h-8 w-8 object-cover rounded" />
                  <span className="font-semibold">{images.length} photo{images.length>1?'s':''} selected</span>
                </>
              ) : (
                <span className="font-semibold">Upload Photos</span>
              )}
            </button>

            {/* Thumbnails */}
            {images.length > 0 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img.dataUrl} alt={img.name} className="h-20 w-28 object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 text-xs flex items-center justify-center"
                      aria-label={`Remove ${img.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
