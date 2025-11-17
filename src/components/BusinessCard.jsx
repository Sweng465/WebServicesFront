import { useNavigate } from "react-router-dom";
import Base64Image from "./Base64Image";

const DEFAULT_PLACEHOLDER = "/assets/business-placeholder.png";

const BusinessCard = ({ business = {}, size = "small", variant = "grid" }) => {
  const navigate = useNavigate();

  const handleViewBusiness = () => {
    const rawId = business?.id ?? business?._id ?? business?.businessId;
    if (rawId === undefined || rawId === null) {
      console.warn("BusinessCard: no id found on business:", business);
      return;
    }

    // Ensure the id is an integer (parse strings like "123" or "123abc" safely)
    const numericId = Number.isInteger(rawId) ? rawId : parseInt(String(rawId).trim(), 10);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      console.warn("BusinessCard: could not parse a valid integer id from:", rawId);
      return;
    }

    navigate(`/businesses/${numericId}`);
  };

  // Normalize common base64/image shapes (similar approach used in Base64Image)
  const rawBase64 =
    business?.imageBase64 ?? business?.base64image ?? business?.base64 ?? business?.logoBase64 ?? null;

  let imageFromBase64 = null;
  if (typeof rawBase64 === "string" && rawBase64.trim()) {
    const s = rawBase64.trim();
    if (s.startsWith("data:")) {
      imageFromBase64 = s;
    } else {
      const cleaned = s.replace(/\s+/g, "");
      if (cleaned.length > 50) {
        imageFromBase64 = `data:image/jpeg;base64,${cleaned}`;
      }
    }
  }

  const imageValue =
    imageFromBase64 ?? business?.imageUrl ?? business?.logoUrl ?? business?.image ?? DEFAULT_PLACEHOLDER;

  const altText = business?.name || "Business image";

  // Layout classes adjusted by `size`
  const isLarge = size === "large";

  if (variant === "list") {
    return (
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex ${
          isLarge ? "h-64" : "h-48"
        }`}
      >
        <div className={`relative overflow-hidden bg-gray-200 ${isLarge ? "w-80" : "w-56"}`}>
          <Base64Image
            value={imageValue}
            mime="image/jpeg"
            alt={altText}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${isLarge ? "text-2xl" : "text-lg"}`}>
              {business.name}
            </h3>

            <div className="space-y-1 mb-3">
              {business.description && (
                <p className={`text-gray-600 font-medium ${isLarge ? "text-base" : "text-sm"}`}>
                  {business.description}
                </p>
              )}

              <p className={`text-gray-600 font-medium ${isLarge ? "text-base" : "text-sm"}`}>
                {business.isVerified ? "Verified Business" : "Unverified Business"}
              </p>
            </div>
          </div>

          <button
            onClick={handleViewBusiness}
            className={`bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
              isLarge ? "py-3 px-6 text-base w-auto self-start" : "py-2 px-4 text-sm w-auto self-start"
            }`}
          >
            View Business
          </button>
        </div>
      </div>
    );
  }

  // Default (grid) card
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col ${
        isLarge ? "h-[32rem]" : "h-full"
      }`}
    >
      <div className={`relative overflow-hidden bg-gray-200 ${isLarge ? "h-72" : "h-48 sm:h-56"}`}>
        <Base64Image value={imageValue} mime="image/jpeg" alt={altText} className="w-full h-48 object-cover" />
      </div>

      <div className={`p-4 sm:p-5 flex-1 flex flex-col ${isLarge ? "p-6" : ""}`}>
        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${isLarge ? "text-2xl" : "text-lg sm:text-xl"}`}>
          {business.name}
        </h3>

        <div className="space-y-1 mb-3 flex-1">
          {business.description && (
            <p className={`text-gray-600 font-medium ${isLarge ? "text-base" : "text-sm"}`}>{business.description}</p>
          )}
          <p className={`text-gray-600 font-medium ${isLarge ? "text-base" : "text-sm"}`}>
            {business.isVerified ? "Verified Business" : "Unverified Business"}
          </p>
        </div>

        {business.isPullYourself !== undefined && (
          <p className={`text-gray-500 mb-4 ${isLarge ? "text-base line-clamp-4" : "text-xs sm:text-sm line-clamp-2"}`}>
            {business.isPullYourself ? "Pull-Yourself Business" : "Not a Pull-Yourself Business"}
          </p>
        )}

        <button
          onClick={handleViewBusiness}
          className={`w-full bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            isLarge ? "py-3 text-base" : "py-2 sm:py-2.5 text-sm sm:text-base"
          }`}
        >
          View Business
        </button>
      </div>
    </div>
  );
};

export default BusinessCard;