import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const canSubmit = email.trim() !== "" && password.trim() !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        fetch(`http://localhost:8000/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                rememberMe: true,
            }),
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log("Login response data:", data);
                if (data.success) {
                    alert("Login Successful", "Welcome back!");
                    // ensure you've added: import { useNavigate } from 'react-router-dom';
                    // and inside the component: const navigate = useNavigate();
                    navigate("/");
                }
                else {
                    setErrorMessage(data.message || "Something went wrong.");
                }
            })
            .catch(error => {
                console.error("Login error:", error);
                setErrorMessage("Something went wrong. Please try again.");
            })
            .finally(() => {
                setLoading(false)
            });
    }

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                {/* simple logo */}
                                <svg
                                    className="w-6 h-6 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-orange-600">DiscoverYou Admin</h1>
                                <p className="text-sm text-gray-500">Sign in to your dashboard</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="mb-2 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded"
                                >
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pr-10 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} color="currentColor" aria-hidden="true" />
                                        ) : (
                                            <Eye size={20} color="currentColor" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="inline-flex items-center gap-2 text-gray-600">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!canSubmit || loading}
                                className={`w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium shadow-sm transition ${canSubmit && !loading
                                    ? "bg-orange-500 hover:bg-orange-600"
                                    : "bg-orange-300 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}