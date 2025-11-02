import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";

const Profile = () => {
  const { user, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);
  console.log("User from context:", user);
  useEffect(() => {
    if (!user?.id || !accessToken) return; 
    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        console.log("Profile API response data:", data);
        setProfile(data.data);
        //console.log("Profile API response data:", data);
        //setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user, authFetch, accessToken]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {profile.username}</h1>
        <p>Email: {profile.email}</p>
        {/* Add more profile details */}
      </div>
    </div>
  );
};

export default Profile;
