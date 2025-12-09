import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import defaultIcon from "../assets/default_icon.png";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Header from "../components/Header";
import FormField from "../components/forms/FormField";
import { Eye, EyeOff } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const regSelVils = ``;

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  // Get user info
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
    setFormSubmitAttempted(true);

    //const payload = { user, username, email, password };
    const payload = {
      userId: user.id,
      username: form.username || profile.username,
      email: form.email || profile.email,
      password: form.password || null,
    };

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
        alert("Profile information successfully updated!");
        //login(data.user, data.accessToken);
        navigate(RoutePaths.PROFILE);
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


        <form onSubmit={handleSubmit}>
          {/* Update to get user's icon from database (replace w/ default if null) */}
          <div>
            <label className="block mb-1 font-medium">Icon</label>
            <img
              src={defaultIcon}
              alt="User profile picture"
              className="w-[150px] h-[150px] object-cover rounded-full shadow-md"
            />
          </div>

          {/* Username */}
          <FormField
            label="New Username"
            id="username"
            type="text"
            value={form.username}
            placeHolder={profile.username}
            onChange={(e) => handleChange("username", e.target.value)}
            maxLength={20}
            helpText="5-20 characters"
          />

          {/* Email */}
          <FormField
            label="New Email Address"
            id="email"
            type="email"
            value={form.email}
            placeHolder={profile.email}
            onChange={(e) => handleChange("email", e.target.value)}
            maxLength={50}
          />

          {/* Password */}
          <div className="flex items-center w-full">
            <FormField
              label="New Password"
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              placeHolder="New Password"
              onChange={(e) => handleChange("password", e.target.value)}
              maxLength={30}
              helpText="8-30 characters"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center w-full">
            <FormField
              label="Confirm New Password"
              id="password confirmation"
              type={showPassword ? "text" : "password"}
              value={form.passwordConfirm}
              placeHolder="Retype New Password"
              onChange={(e) => handleChange("passwordConfirm", e.target.value)}
              maxLength={30}
              helpText="8-30 characters"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="p-2 px-8 mb-4 font-medium text-white rounded-md shadow-md transition bg-blue-700 hover:bg-blue-800"
          >
            Apply Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
