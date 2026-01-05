import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../layouts/AuthLayout";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!userType) {
      setError("Please select account type.");
      return;
    }

    const payload = {
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "customer", // backend-safe
    };

    try {
      setLoading(true);

      await axios.post(
        "https://busticketing-tq3o.onrender.com/api/auth/register",
        payload
      );

      navigate(userType === "admin" ? "/admin/dashboard" : "/customer");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        {/* Header — matches Login */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-10 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Account
          </h1>
          <p className="text-blue-100 text-sm">
            Bus Ticketing System
          </p>
        </div>

        <div className="px-8 py-8 space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            />

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Account Type</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>

            <button
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-blue-700 font-medium hover:underline"
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
