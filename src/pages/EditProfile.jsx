import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../general/RoutePaths.jsx";
import Header from "../components/Header";
import FormField from "../components/forms/FormField";
import { Eye, EyeOff } from "lucide-react";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, login, authFetch, accessToken } = useAuth(); // pull in authFetch from context
  const [profile, setProfile] = useState(null);
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  // Get user info
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

  const isFormValid = () => {
    if (form.password && !form.passwordConfirm) return false;
    // check if any field is filled
    return Object.values(form).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitAttempted(true);
    const errors = [];

    if (form.password && form.password !== form.passwordConfirm) { // check if passwords match
      errors.push("Passwords do not match.");
      return;
    }

    const fieldsToUpdate = {}; // gather modified fields

    if (form.username && form.username !== profile.username)
      fieldsToUpdate.username = form.username;

    if (form.email && form.email !== profile.email)
      fieldsToUpdate.email = form.email;

    if (form.password) fieldsToUpdate.password = form.password;

    let allSuccessful = true;
    try {
      // Update each field individually
      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        const payload = { userId: user.id, [key]: value };
        const response = await fetch(API_ENDPOINTS.UPDATE_LOGIN, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await response.json();
        console.log(`Update ${key} response:`, data);

        // Handle express-validator errors (422)
        if (response.status === 422 && data.errors) {
          const fieldErrors = data.errors.map(err => `${key}: ${err.msg}`);
          errors.push(...fieldErrors);
          allSuccessful = false;
          continue; // continue updating other fields
        }

        // Handle other failures
        if (!response.ok) {
          errors.push(`${key}: ${data.message || "Failed to update."}`);
          allSuccessful = false;
          continue;
        }

        // Apply changes to auth context
        if (key === "username" || key === "email") {
          login(data.user, data.accessToken);
        }

        /*
        if (!response.ok) {
          alert(`Failed to update ${key}: ${data.message}`);
          return; // stop further updates if one fails
        } */

      }

      // result alert
      if (errors.length > 0) {
        alert("Some updates could not be applied:\n\n" + errors.join("\n"));
      } else if (allSuccessful) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Unable to connect to server.");
    }
  };


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-600 to-blue-600 flex flex-col">
      <Header />
      <div className="w-full flex justify-center mt-10 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8 space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-700 hover:underline mb-4"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold text-center">Edit Profile</h1>

          {!profile ? (
            <p className="text-center text-gray-500">Loading profile…</p>
          ) : (
            <>

              {/* Instruction text (only show if user is NOT a seller) */}
              {user.roleId !== 2 && (
                <p className="text-center text-gray-700 mb-6">
                  Want to start listing your inventory?{" "}
                  <button
                    onClick={() => navigate(RoutePaths.SELLERREGISTRATION)}
                    className="text-blue-700 hover:underline"
                  >
                    Register as a seller
                  </button>.
                </p>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Username + Email */}
                  <div className="space-y-6">

                    {/* Username */}
                    <FormField
                      label="New Username"
                      id="username"
                      type="text"
                      value={form.username}
                      placeHolder={profile.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      maxLength={20}
                      helpText="5–20 characters"
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

                  </div>

                  {/* Passwords */}
                  <div className="space-y-6">

                    {/* New Password */}
                    <div className="relative">
                      <FormField
                        label="New Password"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        placeHolder="New Password"
                        onChange={(e) => handleChange("password", e.target.value)}
                        maxLength={30}
                        helpText="8–30 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <FormField
                        label="Confirm New Password"
                        id="passwordConfirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.passwordConfirm}
                        placeHolder="Retype New Password"
                        onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                        maxLength={30}
                        helpText="Must match new password"
                        error={
                          formSubmitAttempted &&
                            form.password &&
                            form.password !== form.passwordConfirm
                            ? "Passwords do not match."
                            : ""
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`px-6 py-2 font-semibold text-white bg-blue-700 rounded-md shadow-md transition
                ${isFormValid()
                        ? "bg-blue-700 text-white hover:bg-blue-800"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                  >
                    Apply Changes
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

};

export default EditProfile;
