import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { buildBusinessDetailUrl } from "../config/api.js";

const cleanString = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/^'+|'+$/g, "").replace(/''/g, "'").trim();
};

const formatPhoneNumber = (value) => {
  if (value === null || value === undefined) return null;
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value;
};

const mergeBusinessData = (fallbackBusiness, fetchedBusiness) => {
  if (!fallbackBusiness) return fetchedBusiness;
  if (!fetchedBusiness) return fallbackBusiness;
  return { ...fallbackBusiness, ...fetchedBusiness };
};

const BusinessInfo = ({ businessId, fallbackBusiness = null, className = "" }) => {
  const [business, setBusiness] = useState(() => fallbackBusiness);
  const [loading, setLoading] = useState(() => Boolean(businessId && !fallbackBusiness));
  const [error, setError] = useState(null);

  // Hooks must be called unconditionally — move useNavigate here
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const shouldFetch = Boolean(businessId);
    if (!shouldFetch) {
      setBusiness(fallbackBusiness);
      setLoading(false);
      setError(null);
      return undefined;
    }

    const loadBusiness = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(buildBusinessDetailUrl(businessId));
        if (!res.ok) {
          throw new Error(`Failed to load business (${res.status})`);
        }
        const data = await res.json();
        const normalized = data?.data ?? data ?? null;
        if (!cancelled) {
          setBusiness((prev) => mergeBusinessData(prev, normalized));
        }
      } catch (err) {
        console.error("Error fetching business info:", err);
        if (!cancelled) {
          setError(err.message || "Failed to load business info.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBusiness();

    return () => {
      cancelled = true;
    };
  }, [businessId, fallbackBusiness]);

  const cleanedBusiness = useMemo(() => {
    if (!business) return null;

    // helpers to safely parse numeric-like rating/count fields
    const pickNumber = (obj, keys = []) => {
      for (const k of keys) {
        const v = obj?.[k];
        if (typeof v === "number" && !Number.isNaN(v)) return v;
        if (typeof v === "string" && v.trim() !== "" && /^[+-]?\d+(\.\d+)?$/.test(v.trim())) return Number(v.trim());
      }
      return null;
    };

    const avgRating = pickNumber(business, [
      "avgRating",
      "averageRating",
      "average_rating",
      "rating",
      "stars",
      "score",
      "ratingAverage",
    ]);

    const reviewsCount = pickNumber(business, [
      "reviewsCount",
      "ratingCount",
      "reviews_count",
      "reviewCount",
      "numReviews",
      "count",
      "reviews",
    ]);

    return {
      ...business,
      name: cleanString(business.name ?? business.businessName ?? ""),
      description: cleanString(business.description ?? business.details ?? ""),
      phoneNumber: formatPhoneNumber(business.phoneNumber ?? business.phone ?? business.contactNumber),
      // normalized rating fields
      avgRating: avgRating !== null ? Number(avgRating) : null,
      reviewsCount: reviewsCount !== null ? Number(reviewsCount) : null,
    };
  }, [business]);

  if (!businessId && !cleanedBusiness) {
    return null;
  }

  // robustly resolve an id from many possible shapes
  const targetBusinessId =
    cleanedBusiness?.businessId ??
    cleanedBusiness?.id ??
    cleanedBusiness?.business_id ??
    businessId ??
    null;

  const handleNavigate = () => {
    if (!targetBusinessId) {
      // helpful debug if navigation doesn't happen
      console.debug("BusinessInfo: no business id to navigate to", { businessId, cleanedBusiness });
      return;
    }
    const template = RoutePaths?.BUSINESS_DETAIL;
    const path = template ? template.replace(":businessId", String(targetBusinessId)) : `/businesses/${targetBusinessId}`;
    navigate(path);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      handleNavigate();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      aria-label={cleanedBusiness?.name ? `View business ${cleanedBusiness.name}` : "View business details"}
      className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${className} cursor-pointer hover:shadow`}
    >
      <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-1">Business</h3>

      {loading && !cleanedBusiness ? (
        <p className="text-sm text-gray-600">Loading business information...</p>
      ) : error && !cleanedBusiness ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : cleanedBusiness ? (
        <div className="space-y-2">
          <div className="flex items-start gap-4">
            <p className="text-lg font-semibold text-gray-800">
              {cleanedBusiness.name || `Business #${cleanedBusiness.businessId ?? businessId ?? "?"}`}
            </p>

            {(cleanedBusiness.avgRating !== null || cleanedBusiness.reviewsCount !== null) && (
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const avg = cleanedBusiness.avgRating ?? 0;
                    const fill = Math.max(0, Math.min(1, avg - i)); // 0..1
                    const percent = Math.round(fill * 100);
                    const clipId = `biz-star-${String(cleanedBusiness.businessId ?? businessId ?? "0")}-${i}`;
                    const d = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.165c.969 0 1.371 1.24.588 1.81l-3.37 2.45a1 1 0 00-.364 1.118l1.287 3.96c.3.922-.755 1.688-1.54 1.118L10 15.347l-3.691 2.586c-.785.57-1.84-.196-1.54-1.118l1.286-3.96a1 1 0 00-.364-1.118L2.326 9.387c-.783-.57-.38-1.81.588-1.81h4.165a1 1 0 00.95-.69l1.286-3.96z";

                    return (
                      <svg key={i} viewBox="0 0 20 20" className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <clipPath id={clipId}>
                            <rect x="0" y="0" width={`${percent}%`} height="100%" />
                          </clipPath>
                        </defs>

                        <path d={d} fill="#e5e7eb" />

                        <path d={d} fill="#f59e0b" clipPath={`url(#${clipId})`} />
                      </svg>
                    );
                  })}
                </div>

                <div className="text-sm text-gray-600">
                  {cleanedBusiness.avgRating !== null ? `${Number(cleanedBusiness.avgRating).toFixed(1)} / 5` : "No rating"}
                  {cleanedBusiness.reviewsCount ? ` · ${cleanedBusiness.reviewsCount} review${cleanedBusiness.reviewsCount !== 1 ? "s" : ""}` : ""}
                </div>
              </div>
            )}
          </div>

          {cleanedBusiness.description && (
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {cleanedBusiness.description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
            {cleanedBusiness.phoneNumber && (
              <p>
                <span className="font-semibold">Phone:</span> {cleanedBusiness.phoneNumber}
              </p>
            )}
            {cleanedBusiness.email && (
              <p>
                <span className="font-semibold">Email:</span> {cleanedBusiness.email}
              </p>
            )}
            {cleanedBusiness.isPullYourself !== undefined && (
              <p>
                <span className="font-semibold">Pull-It-Yourself:</span> {cleanedBusiness.isPullYourself ? "Yes" : "No"}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Business information unavailable.</p>
      )}

      {error && cleanedBusiness && (
        <p className="mt-2 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};

export default BusinessInfo;
