import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://busticketing-tq3o.onrender.com/api/auth/login",
                { email, password }
            );

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("adminUser", JSON.stringify(user));
            localStorage.setItem("isAuthenticated", "true");

            // Redirect all users to admin dashboard
            navigate("/admin/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div>
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-10 text-center">
                    <h1 className="text-3xl font-bold text-white">Admin Login</h1>
                    <p className="text-blue-100 text-sm">Bus Ticketing System</p>
                </div>

                <div className="px-8 py-8 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition disabled:opacity-60"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        No account yet?{" "}
                        <Link
                            to="/register"
                            className="text-blue-700 font-medium hover:underline"
                        >
                            Create one →
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
