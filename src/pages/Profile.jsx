import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import defaultIcon from "../assets/default_icon.png";
import { RoutePaths } from "../general/RoutePaths.jsx";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Profile = () => {
  const { user, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  console.log("User from context:", user);
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

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 flex flex-col items-center">
      <Header />
      <div className="max-w-3xl min-w-100 mx-auto p-6 bg-white rounded-lg mt-6 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-4"> Profile </h1>
        {/* Update to get user's icon from database (replace w/ default if null) */}
        <img
          src={defaultIcon}
          alt="User profile picture"
          className="w-[250px] h-[250px] object-cover rounded-full mb-4"
        />

        <h2 className="text-2xl font-bold mb-4"> {profile.username} </h2>
        <h2 className="text-xl mb-4"> {profile.email} </h2>

        {/* Update to direct to page where users can edit their account details */}
        <button className= "p-2 px-8 font-medium rounded-md transition bg-gray-300 hover:bg-gray-200">
          Manage Account
        </button>

        {/* Add Manage Business button here ? */}
      </div>
    </div>
  );
};

export default Profile;
