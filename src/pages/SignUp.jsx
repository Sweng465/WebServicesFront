import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import API_ENDPOINTS from "../config/api.js";
import FormField from "../components/forms/FormField";

export const SignUp = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formSubmitAttempted, setFormSubmitAttempted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const requiredFields = [
    "username",
    "email",
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
      email: form.email, 
      password: form.password,
    };

    try {
      const response = await fetch(API_ENDPOINTS.SIGN_UP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (response.ok) {
        console.log("Registration successful:", data);
        login(data.user, data.accessToken);
        navigate("/");
      } else {
        console.error("Registration failed:", data.message);
        alert("Registration failed: " + data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Unable to connect to server.");
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-blue-600 px-4 py-12">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-xl w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
          Welcome to SalvageSearch!
        </h1>

        <p className="text-center text-gray-600 mb-2">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            helpText="5-20 characters"
            error={formSubmitAttempted && !form.username ? "Username is required." : ""}
          />

          {/* Email */}
          <FormField
            label="Email Address"
            id="email"
            type="email"
            required
            value={form.email}
            placeHolder="Email Address"
            onChange={(e) => handleChange("email", e.target.value)}
            maxLength={50}
            error={formSubmitAttempted && !form.email ? "Email is required." : ""}
          />

          {/* Password */}
          <FormField
            label="Password"
            id="password"
            type="text"
            required
            value={form.password}
            placeHolder="Password"
            onChange={(e) => handleChange("password", e.target.value)}
            maxLength={30}
            helpText="8-30 characters"
            error={formSubmitAttempted && !form.password ? "Password is required." : ""}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Create Account */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
