import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import defaultIcon from "../assets/default_icon.png";
import { Link } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Header from "../components/Header";

const EditProfile = () => {
  const { user, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);

  const borderStyle = `border border-gray-300 rounded-lg shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-700 transition`;
  const regSelVis = ``;

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  console.log("User from context:", user);
  useEffect(() => {
    if (!user?.id || !accessToken) return;
    const fetchProfile = async () => {
      try {
        const res = await authFetch(API_ENDPOINTS.USER_PROFILE);
        const data = await res.json();
        console.log("Profile API response data:", data);
        setProfile(data.data);

        // visibility for "become a seller" button
        if (user.roleId == 2) regSelVis = `visibility=hidden`;
        else `visibility=visible`;
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    if (user?.id) fetchProfile();
  }, [user, authFetch, accessToken]);

  if (!profile) return <p>Loading profile...</p>;

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { user, username, email, password };

    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_LOGIN, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Update login response data:", data);  // <-- add here

      if (response.ok) {
        console.log("Update login successful:", data);
        //localStorage.setItem("token", data.token);
        login(data.user, data.accessToken);
        navigate("/");
      } else {
        console.error("Update login failed:", data.message);
        alert("Update login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 flex flex-col items-center">
      <Header />
      <div className="space-y-4 items-center max-w-3xl min-w-100 mx-auto p-6 bg-white rounded-lg shadow-lg mt-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center"> Edit Profile </h1>

        
        {/* Update to get user's icon from database (replace w/ default if null) */}
        <div>
          <label className="block mb-1 font-medium">Icon</label>
          <img
            src={defaultIcon}
            alt="User profile picture"
            className="w-[150px] h-[150px] object-cover rounded-full shadow-md"
          />
        </div>

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">Change Username</label>
          <input
            id="username"
            name="username"
            type="text"
            maxLength="20"
            placeholder="Username"
            value={profile.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full p-2 ${borderStyle}`}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Change Email</label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength="50"
            placeholder="Email"
            value={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full p-2 ${borderStyle}`}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">New Password</label>
          <input
            id="password"
            name="password"
            type="text"
            maxLength="30"
            placeholder="Password"
            value={form.newPassword}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full p-2 ${borderStyle}`}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Confirm New Password</label>
          <input
            id="passwordConfirmation"
            name="password"
            type="text"
            maxLength="30"
            placeholder="Password"
            value={form.newPasswordConfirm}
            onChange={(e) => handleChange("passwordConfirm", e.target.value)}
            className={`w-full p-2 ${borderStyle}`}
            required
          />
        </div>

        <Link to={RoutePaths.EDITPROFILE}>
          <button className="p-2 px-8 mb-4 font-medium text-white rounded-md shadow-md transition bg-blue-700 hover:bg-blue-800">
            Apply Changes
          </button>
        </Link>

      </div>
    </div>
  );
};

export default EditProfile;
