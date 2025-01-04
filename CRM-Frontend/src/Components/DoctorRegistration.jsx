import React, { useState } from "react";
import axios from "axios";
import BASE_URL from '../../Config/apiConfig';
const DoctorRegistration = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    status: "ACTIVE", // Default status
  });

  const [responseMessage, setResponseMessage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the form data to the backend
      const response = await axios.post(`${BASE_URL}/registerdoctor`, formData);
      setResponseMessage(response.data.message); // Show success message
      setFormData({
        name: "",
        email: "",
        password: "",
        specialty: "",
        status: "ACTIVE",
      }); // Reset form
    } catch (error) {
      // Handle error response
      setResponseMessage(
        error.response?.data?.message || "Error registering doctor"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register a New Doctor</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="name" className="block text-lg font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-3 mt-2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block text-lg font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-3 mt-2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block text-lg font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-3 mt-2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialty" className="block text-lg font-medium">Specialty</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full border rounded p-3 mt-2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="block text-lg font-medium">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded p-3 mt-2"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg font-semibold px-4 py-3 rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        {responseMessage && (
          <p className="text-center text-lg font-medium text-green-500 mt-4">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorRegistration;
