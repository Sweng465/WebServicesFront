import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import { RoutePaths } from "../general/RoutePaths.jsx";

const ProtectedRouteSeller = ({ children }) => {
  const { user, loading, accessToken, authFetch } = useAuth();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(null);

  useEffect(() => {
    const verifyRole = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        if (Number(data?.data?.roleId) === 2) {
          setIsSeller(true);
        } else {
          setIsSeller(false);
        }
      } catch (error) {
        console.log(error);
        setIsSeller(false);
      }
      setRoleLoading(false);
    };

    if (user && accessToken) {
      verifyRole();
    }
  }, [user, accessToken, authFetch]);

  // If auth still loading
  if (loading) return <>{children}</>; // keep current page UI

  // User not logged in
  if (!user) {
    return <Navigate to={RoutePaths.SIGNIN} replace />;
  }

  // Waiting for seller role check
  if (roleLoading) return <>{children}</>; // keep current page UI

  // Not a seller
  if (!isSeller) {
    return <Navigate to={RoutePaths.SELLERREGISTRATION} replace />;
  }

  // Seller allowed
  return children;
};

export default ProtectedRouteSeller;
