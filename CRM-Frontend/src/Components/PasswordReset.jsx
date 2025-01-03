import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("")
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token')
    console.log(token);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch("${BASE_URL}/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newpassword: newPassword,token }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setMessage(result.message);
          setError("");
        } else {
          setError(result.message || "Something went wrong");
          setMessage("");
        }
      } catch (err) {
        setError("An error occurred while updating the password");
        setMessage("");
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Password
          </h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    );
  };


export default PasswordReset