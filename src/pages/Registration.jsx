import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Registration = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { username, email, password };

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        localStorage.setItem("token", data.token);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-blue-600 px-4 py-12">
      <div className="bg-white bg-opacity-90 shadow-xl rounded-xl w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6">
          Welcome to SalvageSearch!
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Create your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="johnsJunkyard87"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="youremail@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition duration-200"
          >
            Register
          </button>
        </form>

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
