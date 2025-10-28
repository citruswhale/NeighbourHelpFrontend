import React, { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AddServiceModal = ({ onClose, onServiceAdded }) => {
    const [formData, setFormData] = useState({
        serviceName: "",
        serviceType: "",
        description: "",
        contactPhone: "",
        workingStart: "",
        workingEnd: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/services`,
                {
                    serviceName: formData.serviceName,
                    description: formData.description,
                    contactInfo: { phone: formData.contactPhone },
                    workingHours: { start: formData.workingStart, end: formData.workingEnd },
                    serviceType: formData.serviceType,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("Service added successfully!");
            setFormData({
                serviceName: "",
                serviceType: "",
                description: "",
                contactPhone: "",
                workingStart: "",
                workingEnd: "",
            });
            onServiceAdded(); // to refresh service list on parent
            setTimeout(() => onClose(), 1000);
        } catch (err) {
            console.error(err);
            setMessage("Error adding service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
                >
                    <FaTimes size={18} />
                </button>

                <h2 className="text-2xl font-semibold mb-5 text-center">Add New Service</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Service Name</label>
                        <input
                            type="text"
                            name="serviceName"
                            placeholder="e.g., Home Plumbing"
                            value={formData.serviceName}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-teal-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Service Type</label>
                        <input
                            type="text"
                            name="serviceType"
                            placeholder="e.g., Plumbing"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe your service..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Contact Number</label>
                        <input
                            type="text"
                            name="contactPhone"
                            placeholder="e.g., +91 9876543210"
                            value={formData.contactPhone}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium mb-1">Start Time</label>
                            <input
                                type="text"
                                name="workingStart"
                                placeholder="e.g., 9AM"
                                value={formData.workingStart}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">End Time</label>
                            <input
                                type="text"
                                name="workingEnd"
                                placeholder="e.g., 5PM"
                                value={formData.workingEnd}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>

                    {message && (
                        <p
                            className={`text-center text-sm ${
                                message.includes("success")
                                    ? "text-green-600"
                                    : "text-red-500"
                            }`}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-60"
                    >
                        {loading ? "Adding..." : "Add Service"}
                    </button>
                </form>
            </div>
        </div>
);
};

export default AddServiceModal;
