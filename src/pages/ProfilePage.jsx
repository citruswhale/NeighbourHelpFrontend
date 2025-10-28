import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStar, FaPlus } from "react-icons/fa";
import AddServiceModal from "../components/AddServiceModal.jsx";

const ProfilePage = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // ✅ Fetch user data + services + reviews
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

                // Fetch services and reviews by this user
                const [servicesRes, reviewsRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/services/user/${data._id}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/reviews/user/${data._id}`),
                ]);

                setServices(servicesRes.data || []);
                setReviews(reviewsRes.data || []);
            } catch (err) {
                console.error(err);
                setMessage("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // ✅ Handle profile update
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
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

                    <form onSubmit={handleUpdate} className="space-y-5">
                        <div>
                            <label className="block font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
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
                                    setFormData({ ...formData, email: e.target.value })
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
                                    setFormData({ ...formData, phone: e.target.value })
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
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter new password (optional)"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
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

                {/* ✅ My Services Section */}
                <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold">My Services</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                        >
                            <FaPlus /> Add Service
                        </button>

                    </div>

                    {services.length === 0 ? (
                        <p className="text-gray-500">No services added yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {services.map((service) => (
                                <div
                                    key={service._id}
                                    className="p-3 border rounded-lg hover:shadow-sm transition"
                                >
                                    <p className="font-semibold text-lg">{service.serviceName}</p>
                                    <p className="text-gray-600">{service.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ✅ My Reviews Section */}
                <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border">
                    <h3 className="text-2xl font-semibold mb-4">
                        My Reviews ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                        <p className="text-gray-500">You haven’t written any reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b pb-3">
                                    <div className="flex text-orange-500 mb-1">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                    <p className="font-medium">
                                        {review.service?.serviceName || "Unknown Service"} by{" "}
                                        {formData.name}
                                    </p>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {showModal && (
                    <AddServiceModal
                        onClose={() => setShowModal(false)}
                        onServiceAdded={() => window.location.reload()}
                    />
                )}
            </main>
        </div>
    );
};

export default ProfilePage;
