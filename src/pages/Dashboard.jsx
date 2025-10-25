import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const token = localStorage.getItem("token");
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/services`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setServices(data || []);
            } catch (err) {
                console.error("Error fetching services:", err);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Loading services...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ Sticky Header (same as ProfilePage) */}
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 border-b backdrop-blur-md bg-white/60 shadow-sm">
                <h1 className="text-2xl font-bold">
                    <span className="text-teal-600">Neighbor</span>
                    <span className="text-orange-500">Help</span>
                </h1>
                <nav className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-teal-600 font-medium border-b-2 border-teal-600"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-700 hover:text-teal-600 transition-colors"
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

            {/* ✅ Main Content */}
            <main className="pt-24 px-6">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold">
                        Welcome to{" "}
                        <span className="text-teal-600">Neighbor</span>
                        <span className="text-orange-500">Help</span>
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Connect with trusted local service providers in your
                        neighborhood
                    </p>
                </div>

                {/* ✅ Services Grid */}
                {services.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        No services available
                    </p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="border rounded-2xl shadow-sm bg-gradient-to-br from-teal-50 to-orange-50 p-6 text-center transition-transform transform hover:scale-105 hover:shadow-md cursor-pointer"
                            >
                                <div className="text-6xl font-bold text-gray-700 mb-4">
                                    {service.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600">
                                    {service.providerName}
                                </p>
                                <div className="mt-2 flex justify-center items-center text-orange-500 font-medium">
                                    ⭐ {service.rating?.toFixed(1) || "N/A"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;