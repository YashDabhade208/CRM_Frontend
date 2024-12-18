import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="w-96 backdrop-blur-lg bg-opacity-80 rounded-lg shadow-lg p-5 bg-gray-900 text-white mx-auto mt-10">
      <h2 className="text-2xl font-bold pb-5">SignUp</h2>
      <form onSubmit={handleRegister}>
        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 text-sm font-medium">
            Your name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
            placeholder="Andrew Jackson"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Your email
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
            placeholder="andrew@mail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Your password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full py-2.5 px-4"
            placeholder="*********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Message Section */}
        <div>{message && <p className="text-red-500 pb-5">{message}</p>}</div>

        {/* Submit Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className="text-white bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 px-5 w-full sm:w-auto"
          >
            Register
          </button>
          <div className="flex items-center text-sm">
            <p>Already have an account?</p>
            <p
              className="underline cursor-pointer ml-1"
              onClick={() => navigate("/login")}
            >
              Sign in
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
