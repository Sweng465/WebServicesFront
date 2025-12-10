import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import defaultIcon from "../assets/default_icon.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Header from "../components/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { user, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id || !accessToken) return;
    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        console.log("Profile API response data:", data);
        setProfile(data.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user, authFetch, accessToken]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 flex flex-col items-center">
      <Header />
      <div className="max-w-3xl min-w-100 mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 flex flex-col items-center text-center">
        <div className="w-full flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-700 hover:underline mb-4"
          >
            ← Back
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-4"> Profile </h1>

        {!profile ? (
          <p className="text-center text-gray-500">Loading profile…</p>
        ) : (
          <>

            {/* Update to get user's icon from database (replace w/ default if null) */}
            <img
              src={defaultIcon}
              alt="User profile picture"
              className="w-40 h-40 object-cover rounded-full mb-4 shadow-md"
            />

            <h2 className="text-2xl font-bold mb-4"> {profile.username} </h2>
            <h2 className="text-xl font-medium mb-4"> {profile.email} </h2>

            <Link to={RoutePaths.EDITPROFILE}>
              <button className="p-2 px-8 mb-4 font-medium text-white rounded-md shadow-md transition bg-blue-700 hover:bg-blue-800">
                Manage Account
              </button>
            </Link>

            {/* Add Manage Business button here ? */}

          </>
        )}

      </div>
    </div>
  );
};

export default Profile;
