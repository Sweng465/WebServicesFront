import { Navigate} from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { RoutePaths } from "../general/RoutePaths.jsx";

const ProtectedRouteUser = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <>{children}</>; // keep current page UI

  if (user) {
    return <Navigate to={RoutePaths.HOMEPAGE} replace />;
  }

  return children;
};

export default ProtectedRouteUser;