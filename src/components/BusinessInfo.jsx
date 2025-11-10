import { useEffect, useMemo, useState } from "react";
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

    return {
      ...business,
      name: cleanString(business.name ?? business.businessName ?? ""),
      description: cleanString(business.description ?? business.details ?? ""),
      phoneNumber: formatPhoneNumber(business.phoneNumber ?? business.phone ?? business.contactNumber),
    };
  }, [business]);

  if (!businessId && !cleanedBusiness) {
    return null;
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-xl p-4 ${className}`}>
      <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-1">Business</h3>

      {loading && !cleanedBusiness ? (
        <p className="text-sm text-gray-600">Loading business information...</p>
      ) : error && !cleanedBusiness ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : cleanedBusiness ? (
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-800">
            {cleanedBusiness.name || `Business #${cleanedBusiness.businessId ?? businessId ?? "?"}`}
          </p>

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
