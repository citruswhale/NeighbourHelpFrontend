import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        role: "consumer",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setMessage("Email and password are required");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage("Please enter a valid email address");
            return false;
        }
        if (formData.password.length < 6) {
            setMessage("Password must be at least 6 characters long");
            return false;
        }
        if (!isLogin) {
            if (!formData.name || !formData.phone || !formData.address) {
                setMessage("All fields are required for Sign Up");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setMessage("");
        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/register";
            const { data } = await axios.post(`${API_BASE}${endpoint}`, formData);
            localStorage.setItem("userInfo", JSON.stringify(data));
            localStorage.setItem("token", data.token);
            setMessage(isLogin ? "Login successful!" : "Account created!");
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-amber-50">
            <div className="bg-white shadow-md rounded-xl p-8 w-[32rem] max-w-full border border-gray-100">
            <h1 className="text-2xl font-bold text-center">
                    <span className="text-green-700">Neighbor</span>
                    <span className="text-amber-700">Help</span>
                </h1>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Connect with local service providers in your community
                </p>

                {/* Tabs */}
                <div className="flex mb-4 rounded-lg overflow-hidden border border-gray-200">
                    <button
                        onClick={() => {
                            setIsLogin(true);
                            setMessage("");
                        }}
                        className={`w-1/2 py-2 ${
                            isLogin ? "bg-white" : "bg-gray-100 text-gray-500"
                        } font-medium`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => {
                            setIsLogin(false);
                            setMessage("");
                        }}
                        className={`w-1/2 py-2 ${
                            !isLogin ? "bg-white" : "bg-gray-100 text-gray-500"
                        } font-medium`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="w-full border rounded-md px-3 py-2"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                className="w-full border rounded-md px-3 py-2"
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                className="w-full border rounded-md px-3 py-2"
                                onChange={handleChange}
                                required
                            />

                            {/* Role Selection */}
                            <div className="text-sm text-gray-600 mt-2">
                                Choose your account type:
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                                “Consumer” if you’re looking for services, “Provider” if you
                                offer them.
                            </p>
                            <div className="flex justify-between bg-gray-50 rounded-md border px-3 py-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="consumer"
                                        checked={formData.role === "consumer"}
                                        onChange={handleChange}
                                    />
                                    <span>Consumer</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="provider"
                                        checked={formData.role === "provider"}
                                        onChange={handleChange}
                                    />
                                    <span>Provider</span>
                                </label>
                            </div>
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        className="w-full border rounded-md px-3 py-2"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="password"
                        className="w-full border rounded-md px-3 py-2"
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${
                            loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
                        } text-white rounded-md py-2 font-semibold transition`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                  <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                  ></circle>
                  <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Please wait...
              </span>
                        ) : isLogin ? (
                            "Sign In"
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center text-sm mt-3 ${
                            message.toLowerCase().includes("success")
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AuthPage;
