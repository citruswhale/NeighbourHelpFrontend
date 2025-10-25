import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ✅ Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setFormData({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone || "",
                    address: data.address || "",
                    password: "",
                });
            } catch (err) {
                setMessage("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // ✅ Validation
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
        if (!formData.name || !formData.phone || !formData.address) {
            setMessage("All fields are required");
            return false;
        }
        return true;
    };

    // ✅ Handle profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
                {
                    id: formData.id,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMessage("Profile updated successfully!");
            setFormData({ ...formData, password: "" });
        } catch (err) {
            setMessage("Error updating profile");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ Sticky Glassy Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 border-b backdrop-blur-md bg-white/60 shadow-sm">
                <h1 className="text-2xl font-bold">
                    <span className="text-teal-600">Neighbor</span>
                    <span className="text-orange-500">Help</span>
                </h1>
                <nav className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-gray-700 hover:text-teal-600 transition-colors"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-teal-600 font-medium border-b-2 border-teal-600"
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                        className="text-gray-700 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            {/* ✅ Main Content with Padding for Fixed Header */}
            <main className="pt-24">
                <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border">
                    <h2 className="text-3xl font-bold mb-6">My Profile</h2>
                    <h3 className="text-xl font-semibold mb-4">
                        Personal Information
                    </h3>

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="block font-medium mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter new password (optional)"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        {message && (
                            <p
                                className={`text-center text-sm ${
                                    message.includes("successfully")
                                        ? "text-green-600"
                                        : "text-red-500"
                                }`}
                            >
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
                        >
                            Update Profile
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
