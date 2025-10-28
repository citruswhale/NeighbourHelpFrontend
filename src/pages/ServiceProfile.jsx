import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaArrowLeft, FaEnvelope, FaPhone, FaClock} from "react-icons/fa";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

const ServiceProfile = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        const fetchService = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/services/${serviceId}`
                );
                setService(data);
            } catch (err) {
                console.error("Error fetching service:", err);
            }
        };
        fetchService();
    }, [serviceId]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/reviews/${serviceId}`
                );
                setReviews(data);
            } catch (err) {
                console.error("Error fetching reviews:", err);
            }
        };
        fetchReviews();
    }, [serviceId]);

    const submitReview = async () => {
        if (!rating) return alert("Please select a rating!");
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/reviews/add/${serviceId}`,
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComment("");
            setRating(0);
            setHover(null);
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/reviews/${serviceId}`
            );
            setReviews(data);
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    if (!service) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                Loading service details...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 border-b backdrop-blur-md bg-white/60 shadow-sm">
                <h1 className="text-2xl font-bold">
                    <button onClick={() => navigate("/dashboard")}>
                        <span className="text-teal-600">Neighbor</span>
                        <span className="text-orange-500">Help</span>
                    </button>
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
                            navigate("/auth");
                        }}
                        className="text-gray-700 hover:text-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <div className="max-w-6xl mx-auto p-6 pt-28">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition-colors"
                >
                    <FaArrowLeft /> Back to Home
                </button>

                <motion.div
                    className="relative flex flex-col lg:flex-row gap-12 bg-gradient-to-br from-teal-50 to-orange-50 rounded-3xl shadow-lg p-10 mb-14"
                    style={{ minHeight: "60vh" }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex-shrink-0 flex justify-center items-center w-full lg:w-1/2">
                        <div className="w-[26rem] h-[26rem] lg:w-[26rem] lg:h-[26rem] rounded-3xl bg-white shadow-xl flex items-center justify-center text-[18rem] font-mono text-gray-700 uppercase">
                            {service.serviceName.charAt(0)}
                        </div>
                    </div>

                    <div className="flex flex-col justify-center lg:w-1/2 space-y-6">
                        <div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 mb-3">
                                {service.serviceName}
                            </h1>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {service.description || "No description provided"}
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FaStar className="text-yellow-500 text-2xl" />
                            <span className="text-2xl font-semibold text-gray-800">
                                {service.rating?.toFixed(1) || "0.0"}
                            </span>
                            <span className="text-gray-600 text-sm">
                                ({service.totalReviews || 0} reviews)
                            </span>
                        </div>

                        <div className="mt-4 bg-white border rounded-2xl p-6 shadow-sm">
                            <h2 className="font-semibold text-gray-800 mb-4 text-xl">
                                Provider Information
                            </h2>
                            <div className="space-y-3 text-gray-700 text-base">
                                <p>
                                    <strong>Name:</strong>{" "}
                                    {service.provider?.name || "N/A"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaEnvelope className="text-teal-500" />{" "}
                                    {service.provider?.email || "Not provided"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaPhone className="text-orange-500" />{" "}
                                    {service.provider?.phone || "Not provided"}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FaClock className="text-gray-500" />{" "}
                                    {service.workingHours?.start
                                        ? `${service.workingHours.start} - ${service.workingHours.end}`
                                        : "Flexible hours"}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ✅ Review Section */}
                <motion.div
                    className="bg-white rounded-2xl shadow-md p-8 mt-10"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Leave a Review
                    </h2>

                    <div className="flex items-center mb-5 space-x-3">
                        {[...Array(5)].map((_, index) => {
                            const currentRating = index + 1;
                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => setRating(currentRating)}
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                    whileHover={{ scale: 1.2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <FaStar
                                        size={30}
                                        className={`cursor-pointer ${
                                            currentRating <= (hover || rating)
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                </motion.button>
                            );
                        })}
                    </div>

                <textarea
                    placeholder="Share your experience..."
                    className="w-full border rounded-xl p-4 mb-5 focus:ring-2 focus:ring-teal-300 outline-none resize-none text-gray-700"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-teal-700"
                    onClick={submitReview}
                >
                    Submit Review
                </motion.button>
            </motion.div>

            <div className="bg-white rounded-2xl shadow-md p-8 mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review, idx) => (
                            <motion.div
                                key={idx}
                                className="p-5 border rounded-xl hover:shadow-md transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div className="flex items-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            size={18}
                                            className={`${
                                                i < review.rating ? "text-yellow-400" : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                    <span className="ml-3 text-gray-700 font-semibold">
                    {review.user?.name || "Anonymous"}
                  </span>
                                </div>
                                <p className="text-gray-600">{review.comment || "No comment provided"}</p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-base">
                        No reviews yet. Be the first to leave one!
                    </p>
                )}
            </div>
            </div>
        </div>
    );
};

export default ServiceProfile;
