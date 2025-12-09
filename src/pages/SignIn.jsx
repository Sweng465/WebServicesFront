import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import FormField from "../components/forms/FormField";
import { Eye, EyeOff } from "lucide-react";

export const SignIn = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const requiredFields = [
    "username",
    "password",
  ];

  const isFormValid = () => { // check if all required fields are filled
    return requiredFields.every((field) => {
      const value = form[field];
      return value !== "" && value !== null && value !== undefined;
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

    if (!isFormValid()) {
      return; // fields will turn red
    }

    const payload = {
      username: form.username,
      password: form.password,
    };

    try {
      const response = await fetch(API_ENDPOINTS.SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        login(data.user, data.accessToken);  // update auth context state
        navigate("/"); // send user to homepage on successful login
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-blue-600 px-4 py-12">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-xl w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
          Welcome Back to SalvageSearch!
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Sign in to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-2">

          {/* Username */}
          <FormField
            label="Username"
            id="username"
            type="text"
            required
            value={form.username}
            placeHolder="Username"
            onChange={(e) => handleChange("username", e.target.value)}
            maxLength={20}
            error={formSubmitAttempted && !form.username ? "Username is required." : ""}
          />

          {/* Password */}
          <div className="relative">
            <FormField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"} 
              required
              value={form.password}
              placeHolder="Password"
              onChange={(e) => handleChange("password", e.target.value)}
              maxLength={30}
              error={formSubmitAttempted && !form.password ? "Password is required." : ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[calc(50%+2px)] transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-lg bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};
