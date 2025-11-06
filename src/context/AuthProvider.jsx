import { createContext, useState, useEffect, useCallback } from "react";
//import { useNavigate} from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);



  // Login: store access token and user info
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setAccessToken(token);
    setUser(userData);
  };

  // Logout: clear tokens and user state
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAccessToken(null);
    setUser(null);
    setLoading(false); // important!
    // call backend logout to clear refresh token cookie
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    //navigate("/signin");
    //window.location.href = "/signin";
  }, []);

 const refreshAccessToken = useCallback(async () => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Could not refresh token");
    const data = await res.json();

    // Decode user from new token
    const payload = JSON.parse(atob(data.accessToken.split(".")[1]));

    setAccessToken(data.accessToken);
    localStorage.setItem("token", data.accessToken);
    setUser(payload);  // set user from decoded payload

    return data.accessToken;
  } catch (error) {
    logout();
    throw error;
  }
}, [logout]);

  useEffect(() => {
    const initializeAuth = async () => {
      let token = localStorage.getItem("token");

      const isTokenExpired = (token) => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const now = Date.now() / 1000;
          return payload.exp < now;
        } catch {
          return true; // treat errors as expired token
        }
      };

      if (token) {
        if (isTokenExpired(token)) {
          // Token expired, try to refresh
          try {
            token = await refreshAccessToken();
          } catch {
            logout();
            return;
          }
        }
      } else {
        // No token, try to refresh
        try {
          token = await refreshAccessToken();
        } catch {
          logout();
          return;
        }
      }

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setAccessToken(token);
          setUser(payload);
        } catch (e) {
          console.error("Invalid token", e);
          logout();
        } finally {
          setLoading(false); // always stop loading
        }
      }
      //setLoading(false);
    };

    initializeAuth();
  }, [refreshAccessToken, logout]);

  // Wrapper around fetch to handle 401, refresh tokens, and retry
  const authFetch = async (url, options = {}) => {
    let token = accessToken;

    const isExpired = (token) => {
      if (!token) return true;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp < Date.now() / 1000;
      } catch {
        return true;
      }
    };

    // If the token is missing or expired, attempt to refresh it before making the API call.
    if (isExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch {
        logout();
        throw new Error("Session expired. Please sign in again.");
      }
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      try {
        const newToken = await refreshAccessToken();
        options.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, options);
      } catch {
        logout();
        throw new Error("Session expired. Please sign in again.");
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, accessToken, authFetch, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
