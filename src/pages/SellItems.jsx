import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
import Header from "../components/Header";
import VehicleSearch from "../components/vehicle/VehicleSearch";
import PartSearch from "../components/part/PartSearch";
import API_ENDPOINTS from "../config/api.js";
import Converter from "../imageConversion/ImageConverter.js";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { useNavigate } from "react-router-dom";
import FormField from "../components/forms/FormField";
import CollapsibleToggle from "../components/forms/CollapsibleToggle";

const DEFAULT_FILTERS = {
  yearId: "",
  makeId: "",
  modelId: "",
  submodelId: "",
  category1Id: "",
  category2Id: "",
  category3Id: "",
  brandId: "",
  vehicleId: "",
};

const DEFAULT_FORM = {
  description: "",
  conditionId: "",
  price: "",
};

const FALLBACK_CONDITIONS = [
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

const borderStyle = `border border-gray-300 rounded-lg shadow-sm \
    focus:outline-none focus:ring-2 focus:ring-blue-700 transition`;

const SellItems = () => {
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [sellMode, setSellMode] = useState("vehicle"); // "vehicle" | "part"
  const [isGenericPart, setIsGenericPart] = useState(false);

  const [conditions, setConditions] = useState([]);

  // Image upload state
  const [images, setImages] = useState([]); // { name, dataUrl, file }
  const fileInputRef = useRef(null);

  // Form state
  const [form, setForm] = useState(DEFAULT_FORM);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const requiredFields = [
    "description",
    "conditionId",
    "price",
  ];

  // Helper to check a list of filter keys are populated
  const allFilled = (keys) => keys.every((k) => !!filters[k]);

  // Keep Listing Info collapsible locked until a vehicle is selected
  const [infoOpen, setinfoOpen] = useState(true);
  const [infoLocked, setinfoLocked] = useState(true); // cannot toggle until vehicle selected
  const toggleInfo = () => {
    if (!infoLocked) setinfoOpen(!infoOpen);
  };
  useEffect(() => {
    if (sellMode === "vehicle") {
      const ok = allFilled(["yearId", "makeId", "modelId", "submodelId"]);
      setinfoLocked(!ok);
      setinfoOpen(ok);
      return;
    }

    if (sellMode === "part") {
      if (isGenericPart) {
        const ok = allFilled(["category1Id", "category2Id", "category3Id", "brandId"]);
        setinfoLocked(!ok);
        setinfoOpen(ok);
        return;
      }
      const ok = allFilled(["yearId", "makeId", "modelId", "submodelId", "category1Id", "category2Id", "category3Id", "brandId"]);
      setinfoLocked(!ok);
      setinfoOpen(ok);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellMode, isGenericPart, filters.yearId, filters.makeId, filters.modelId, filters.submodelId, filters.category1Id, filters.category2Id, filters.category3Id, filters.brandId]);

  // auto-fetch vehicleId whenever full selection is made
  useEffect(() => {
    if (!allFilled(["yearId", "makeId", "modelId", "submodelId"])) {
      // clear vehicleId if incomplete
      setFilters((prev) => ({ ...prev, vehicleId: "" }));
      return;
    }

    // fetch vehicle ID automatically
    fetchVehicleId(filters)
      .then((vehicleId) => setFilters((prev) => ({ ...prev, vehicleId })))
      .catch(() => setFilters((prev) => ({ ...prev, vehicleId: "" })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.yearId, filters.makeId, filters.modelId, filters.submodelId]);

  useEffect(() => {
    // When vehicle changes, reset part filters
    setFilters((prev) => ({ ...prev, category1Id: "", category2Id: "", category3Id: "", brandId: "" }));
  }, [filters.vehicleId]);


  const isFormValid = () => requiredFields.every((field) => {
    const value = form[field];
    return value !== "" && value !== null && value !== undefined;
  });

  const isFiltersValid = () => {
    if (sellMode === "vehicle") return allFilled(["yearId", "makeId", "modelId", "submodelId"]);
    if (sellMode === "part") return isGenericPart ? allFilled(["category1Id", "category2Id", "category3Id", "brandId"]) : allFilled(["yearId", "makeId", "modelId", "submodelId", "category1Id", "category2Id", "category3Id", "brandId"]);
    return false;
  };


  // Load conditions
  useEffect(() => {
    fetch(API_ENDPOINTS.CONDITIONS)
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data && data.data) ? data.data : [];
        if (arr && arr.length) {
          setConditions(arr);
        } else {
          setConditions(FALLBACK_CONDITIONS);
        }
      })
      .catch((err) => {
        console.error("Error loading conditions:", err);
        setConditions(FALLBACK_CONDITIONS);
      });
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

  const fetchPartId = async (filters) => {
    if (isGenericPart) { // won't require vehicle id
      const query = new URLSearchParams({
        category1Id: filters.category1Id,
        category2Id: filters.category2Id,
        category3Id: filters.category3Id,
        brandId: filters.brandId,
      });
      const res = await fetch(`${API_ENDPOINTS.PARTS}?${query}`);
      const data = await res.json();

      const parts = data.data || data.parts || data || [];
      if (!Array.isArray(parts) || parts.length === 0) {
        alert("Error: Part not found.");
        throw new Error("No generic part found for selected combination.");
      }
        

      return parts[0].partId;
    }
    else { // requires vehicle id
      const vehicleId = await fetchVehicleId(filters);
      setFilters(prev => ({ ...prev, vehicleId }));
      const query = new URLSearchParams({
        category1Id: filters.category1Id,
        category2Id: filters.category2Id,
        category3Id: filters.category3Id,
        brandId: filters.brandId,
        vehicleId,
      });
      const res = await fetch(`${API_ENDPOINTS.PARTS}?${query}`);
      const data = await res.json();

      const parts = data.data || data.parts || data || [];
      if (!Array.isArray(parts) || parts.length === 0) {
        alert("Error: Part not found.");
        throw new Error("No branded part found for selected combination.");
      }

      return parts[0].partId;
    }

  };

  const PRICE_LIMIT = 6; // maximum digits before decimal (optional)

  const handlePriceChange = (value) => {
    // Allow only digits and optional decimal point, max 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(value) && value.length <= PRICE_LIMIT + 3) {
      handleChange("price", value);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const MAX_IMAGES = 20;
  const MAX_FILE_MB = 10;
  const ACCEPT_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  // File input change: convert files to data URLs for preview and for sending
  const handleFileChange = (e) => {
    const chosenFiles = Array.from(e.target.files || []);
    if (chosenFiles.length === 0) return;

    // File amount checking
    // Prevent exceeding limit
    if (images.length >= MAX_IMAGES) {
      alert(`You can upload up to ${MAX_IMAGES} photos.`);
      return;
    }

    // Trim selected files so total does not exceed MAX_IMAGES
    const availableSlots = MAX_IMAGES - images.length;
    const limitedFiles = chosenFiles.slice(0, availableSlots);

    if (limitedFiles.length < chosenFiles.length) {
      alert(`Only ${availableSlots} more photo(s) can be added (max ${MAX_IMAGES}).`);
      return;
    }

    // File size/type checking
    const validFiles = [];
    chosenFiles.forEach((file) => {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        alert(`${file.name} is too large. Max size is ${MAX_FILE_MB}MB`);
        return;
      }
      if (!ACCEPT_TYPES.includes(file.type)) {
        alert(`${file.name} is not an allowed file type.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    const readers = validFiles.map((file) => {
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
    setFormSubmitAttempted(true);

    if (!isFormValid() || !isFiltersValid()) {
      return; // fields will turn red
    }

    try {
      //const vehicleId = await fetchVehicleId(filters);
      let itemId = null;
      let listingTypeId = null;

      // VEHICLE LISTING
      if (sellMode === "vehicle") {
        itemId = await fetchVehicleId(filters);
        listingTypeId = 1;
      }

      // PART LISTING
      if (sellMode === "part") {
        itemId = await fetchPartId(filters);
        listingTypeId = 2;
      }


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

      const business = await authFetch(`${API_ENDPOINTS.BUSINESSES}/user/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Business fetch response:", business);
      const businessData = await business.json();
      console.log("Business data:", businessData);
      const businessInfo = businessData.data;

      const payload = {
        businessId: businessInfo.businessId,
        date: new Date().toISOString(),
        price: parseFloat(form.price),
        description: form.description,
        isAvailable: 1,
        conditionId: parseInt(form.conditionId),
        disabled: 0,
        listingTypeId,
        itemId,
        images: imagesPayload,
      };

      const res = await authFetch(API_ENDPOINTS.CREATE_LISTING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Listing created:", data);
      if (sellMode === "vehicle") {
        navigate(RoutePaths.LISTING_DETAIL.replace(":listingId", data.listingInfoId));
      } else {
        navigate(RoutePaths.PART_LISTING_DETAIL.replace(":listingId", data.listingInfoId));
      }
    } catch (err) {
      console.error("Failed to create listing:", err);
    }
  };

  //const { yearId, makeId, modelId, submodelId } = filters;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 text-white">
      <Header />
      <div className="max-w-5xl mx-auto p-6 bg-white bg-opacity-90 text-gray-800 rounded-lg mt-6">
        <h2 className="text-center text-2xl font-bold mb-4">Create Listing</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Vehicle/Part Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setSellMode("vehicle")}
              className={`w-25 px-5 py-2 rounded-full font-medium transition
      ${sellMode === "vehicle"
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Vehicle
            </button>

            <button
              type="button"
              onClick={() => setSellMode("part")}
              className={`w-25 px-5 py-2 rounded-full font-medium transition
      ${sellMode === "part"
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Part
            </button>
          </div>

          {/* Search Box — Vehicle or Part */}
          <div className={`p-4 ${borderStyle}`}>
            <h3 className="text-lg font-semibold mb-2">
              {sellMode === "vehicle" ? "Select Vehicle" : "Select Part"}
            </h3>

            {sellMode === "vehicle" ? ( // Vehicle search
              <VehicleSearch filters={filters} setFilters={setFilters} />
            ) : ( // part searcg
              <div className="space-y-3">
                {/* Generic checkbox */}
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    checked={isGenericPart}
                    onChange={(e) => setIsGenericPart(e.target.checked)}
                  />
                  Generic Part (Not for a specific vehicle)
                </label>

                {!isGenericPart && ( // non-generic = show vehicle option
                  <VehicleSearch filters={filters} setFilters={setFilters} />)}

                <PartSearch
                  filters={filters} // pass the entire state object
                  setFilters={setFilters}
                  vehicleId={isGenericPart ? null : filters.vehicleId}
                  requireVehicle={!isGenericPart}
                />




              </div>
            )}
          </div>

          <CollapsibleToggle
            title="Listing Information"
            isOpen={infoOpen}
            onToggle={toggleInfo}
          >
            <div className="space-y-1">
              {/* Description */}
              <FormField
                label="Description"
                as="textarea"
                required
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                maxLength={300}
                helpText="Max 300 characters"
                placeholder="Ex. Silver Ford Ranger '02, heavily rusted frame."
                error={formSubmitAttempted && !form.description ? "Description is required." : ""}
              />


              {/* Condition */}
              <FormField
                label="Condition"
                as="select"
                required
                value={form.conditionId}
                onChange={(e) => handleChange("conditionId", e.target.value)}
                error={formSubmitAttempted && !form.conditionId ? "Please select a condition." : ""}>
                <option value="">Select Condition</option>
                {conditions.map(c => (
                  <option key={c.conditionId} value={c.conditionId}>
                    {c.value}
                  </option>
                ))}
              </FormField>

              {/* Price */}
              <FormField
                label="Price"
                type="text"
                inputMode="numeric"
                required
                value={form.price}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="$"
                error={formSubmitAttempted && !form.price ? "Price is required." : ""}
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
                  className="w-full p-2 bg-gray-300 hover:bg-gray-200 text-gray-800 rounded flex items-center gap-3"
                >
                  {images.length > 0 ? (
                    <>
                      <img src={images[0].dataUrl} alt="preview" className="h-8 w-8 object-cover rounded" />
                      <span className="font-semibold">{images.length} photo{images.length > 1 ? 's' : ''} selected</span>
                    </>
                  ) : (
                    <div className="w-full flex flex-col items-center leading-tight">
                      <span className="font-semibold w-full text-center">Upload Photos</span>
                      <span className="text-xs font-normal gap-y-2 text-gray-600">.png, .jpg, .jpeg (Max {MAX_FILE_MB} MB, max {MAX_IMAGES} photos)</span>
                    </div>
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
            </div>
          </CollapsibleToggle>

          {/* Create Listing Button */}
          <div className="relative group w-full">
            <button
              type="submit"
              disabled={!(isFormValid() && isFiltersValid())}
              className={`w-full p-2 font-medium rounded-md transition
                ${isFormValid() && isFiltersValid()
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
              Create Listing
            </button>
            {!(isFormValid() && isFiltersValid()) && (
              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100
                transition-opacity whitespace-nowrap pointer-events-none">
                All required fields and filters must be filled out.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellItems;
